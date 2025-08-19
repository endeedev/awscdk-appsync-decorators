import { Duration } from 'aws-cdk-lib';
import { AppsyncFunction, BaseDataSource, FunctionRuntime, ISchema } from 'aws-cdk-lib/aws-appsync';
import {
    CodeFirstSchema,
    Directive,
    EnumType,
    Field,
    FieldOptions,
    IIntermediateType,
    InputType,
    InterfaceType,
    ObjectType,
    ResolvableField,
    ResolvableFieldOptions,
    Type as TypeBase,
    UnionType,
} from 'awscdk-appsync-utils';

import {
    ArgInfo,
    DirectiveInfo,
    GraphqlType,
    ModifierInfo,
    PropertyInfo,
    ResolverInfo,
    Type,
    TypeInfo,
} from '@/common';
import { DIRECTIVE_ID, LAMBDA_DIRECTIVE_STATEMENT, METADATA, RESOLVER_RUNTIME, TYPE_ID, TYPE_NAME } from '@/constants';
import { JsResolver, VtlResolver } from '@/resolvers';

import { TypeReflector } from './type-reflector';

type DirectiveFactory = (context: DirectiveInfo['context']) => Directive;
type IntermediateTypeFactory = (typeInfo: TypeInfo) => IIntermediateType;

type DataSources = Readonly<Record<string, BaseDataSource>>;
type Functions = Readonly<Record<string, AppsyncFunction>>;

interface SchemaBindOptions {
    readonly dataSources?: DataSources;
    readonly functions?: Functions;
}

export class SchemaBinder {
    private _schema: CodeFirstSchema;

    private _intermediateTypeStore: Record<string, IIntermediateType>;

    private _directiveFactories: Readonly<Record<string, DirectiveFactory>>;
    private _intermediateTypeFactories: Readonly<Record<string, IntermediateTypeFactory>>;

    private _query?: Type<object>;
    private _mutation?: Type<object>;
    private _subscription?: Type<object>;

    get schema(): ISchema {
        return this._schema;
    }

    constructor() {
        this._schema = new CodeFirstSchema();

        // Initialize the type store
        this._intermediateTypeStore = {};

        // Register the factories
        this._directiveFactories = {
            [DIRECTIVE_ID.API_KEY]: this.createApiKeyDirective.bind(this),
            [DIRECTIVE_ID.COGNITO]: this.createCognitoDirective.bind(this),
            [DIRECTIVE_ID.CUSTOM]: this.createCustomDirective.bind(this),
            [DIRECTIVE_ID.IAM]: this.createIamDirective.bind(this),
            [DIRECTIVE_ID.LAMBDA]: this.createLambdaDirective.bind(this),
            [DIRECTIVE_ID.OIDC]: this.createOidcDirective.bind(this),
            [DIRECTIVE_ID.SUBSCRIBE]: this.createSubscribeDirective.bind(this),
        };

        this._intermediateTypeFactories = {
            [TYPE_ID.ENUM]: this.createEnumType.bind(this),
            [TYPE_ID.INPUT]: this.createInputType.bind(this),
            [TYPE_ID.INTERFACE]: this.createInterfaceType.bind(this),
            [TYPE_ID.OBJECT]: this.createObjectType.bind(this),
            [TYPE_ID.UNION]: this.createUnionType.bind(this),
        };
    }

    addQuery(query: Type<object>): void {
        this._query = query;
    }

    addMutation(mutation: Type<object>): void {
        this._mutation = mutation;
    }

    addSubscription(subscription: Type<object>): void {
        this._subscription = subscription;
    }

    bindSchema(options?: SchemaBindOptions): void {
        // Add the query type
        if (this._query) {
            const fields = this.createFields(
                {
                    typeId: TYPE_ID.QUERY,
                    typeName: TYPE_NAME.QUERY,
                    definitionType: this._query as Type<object>,
                },
                options,
            );

            for (const [name, field] of Object.entries(fields)) {
                this._schema.addQuery(name, field);
            }
        }

        // Add the mutation type
        if (this._mutation) {
            const fields = this.createFields(
                {
                    typeId: TYPE_ID.MUTATION,
                    typeName: TYPE_NAME.MUTATION,
                    definitionType: this._mutation as Type<object>,
                },
                options,
            );

            for (const [name, field] of Object.entries(fields)) {
                this._schema.addMutation(name, field);
            }
        }

        // Add the subscription type
        if (this._subscription) {
            const fields = this.createFields(
                {
                    typeId: TYPE_ID.SUBSCRIPTION,
                    typeName: TYPE_NAME.SUBSCRIPTION,
                    definitionType: this._subscription as Type<object>,
                },
                options,
            );

            for (const [name, field] of Object.entries(fields)) {
                this._schema.addSubscription(name, field);
            }
        }
    }

    private createFields(typeInfo: TypeInfo, options?: SchemaBindOptions): Readonly<Record<string, Field>> {
        const fieldInfos = TypeReflector.getFieldInfos(typeInfo);

        const dataSources = options?.dataSources ?? {};
        const functions = options?.functions ?? {};

        // Create the fields for the type field infos
        return fieldInfos.reduce((output, { propertyInfo, modifierInfo, argInfos }) => {
            const { propertyName, returnTypeInfo } = propertyInfo;

            const directives = this.createDirectives(typeInfo, propertyInfo);
            const returnType = this.createType(returnTypeInfo, modifierInfo);
            const args = this.createArgs(argInfos);

            const fieldOptions: FieldOptions = {
                directives,
                returnType,
                args,
            };

            // If resolve info is found then a resolvable field is needed
            // Else return a standard field - cannot be a resolvable field otherwise an empty cdk resolver is generated
            const resolverInfo = TypeReflector.getMetadataResolverInfo(typeInfo, propertyInfo);

            return {
                ...output,
                [propertyName]: resolverInfo
                    ? this.createResolvableField(
                          typeInfo,
                          propertyInfo,
                          fieldOptions,
                          resolverInfo,
                          dataSources,
                          functions,
                      )
                    : new Field(fieldOptions),
            };
        }, {});
    }

    private createDirectives(typeInfo: TypeInfo, propertyInfo?: PropertyInfo): Directive[] {
        const directiveInfos = TypeReflector.getMetadataDirectiveInfos(typeInfo, propertyInfo);

        // Map each directive info to the relevant directive type
        return directiveInfos.map((directiveInfo) => {
            const { directiveId, context } = directiveInfo;

            const factory = this._directiveFactories[directiveId];

            if (!factory) {
                throw new Error(`Unable to create directive of type '${directiveId}'.`);
            }

            return factory(context);
        });
    }

    private createType(typeInfo: TypeInfo, modifierInfo: ModifierInfo): GraphqlType {
        const { typeId, definitionType } = typeInfo;

        // Build the scalar types separately
        if (typeId === TYPE_ID.SCALAR) {
            return new GraphqlType(`${definitionType}` as TypeBase, {
                ...modifierInfo,
            });
        }

        // Build any other intermediate types
        return new GraphqlType(TypeBase.INTERMEDIATE, {
            intermediateType: this.createIntermediateType(typeInfo),
            ...modifierInfo,
        });
    }

    private createIntermediateType(typeInfo: TypeInfo): IIntermediateType {
        const { typeId, typeName } = typeInfo;

        // Lookup the type in the store
        let intermediateType = this._intermediateTypeStore[typeName];

        // If not found, create a definition and add to the store
        if (!intermediateType) {
            const factory = this._intermediateTypeFactories[typeId];

            if (!factory) {
                throw new Error(`Unable to create type '${typeId}'.`);
            }

            intermediateType = factory(typeInfo);

            this._intermediateTypeStore[typeName] = intermediateType;

            // Add the type to the schema definition
            this._schema.addType(intermediateType);
        }

        return intermediateType;
    }

    private createArgs(argInfos: ArgInfo[]): Readonly<Record<string, GraphqlType>> | undefined {
        // If no arguments then return an undefined value
        if (argInfos.length === 0) {
            return undefined;
        }

        return argInfos.reduce(
            (output, { propertyInfo: { propertyName, returnTypeInfo }, modifierInfo }) => ({
                ...output,
                [propertyName]: this.createType(returnTypeInfo, modifierInfo),
            }),
            {},
        );
    }

    private createResolvableField(
        typeInfo: TypeInfo,
        propertyInfo: PropertyInfo,
        fieldOptions: FieldOptions,
        resolverInfo: ResolverInfo,
        dataSources: DataSources,
        functions: Functions,
    ): ResolvableField {
        const { resolverType } = resolverInfo;

        const instance = new resolverType();

        // Initialize the resolvable field options
        const { maxBatchSize } = instance;

        let resolvableFieldOptions: ResolvableFieldOptions = {
            ...fieldOptions,
            maxBatchSize,
        };

        // Determine if caching options are needed
        const cacheInfo = TypeReflector.getMetadataCacheInfo(typeInfo, propertyInfo);

        if (cacheInfo) {
            const { ttl, keys: cachingKeys } = cacheInfo;
            resolvableFieldOptions = {
                ...resolvableFieldOptions,
                cachingConfig: {
                    ttl: Duration.seconds(ttl),
                    cachingKeys,
                },
            };
        }

        // Determine the resolver operation type
        const { runtime } = instance;

        if (runtime === RESOLVER_RUNTIME.JS) {
            const { code } = instance as JsResolver;
            resolvableFieldOptions = {
                ...resolvableFieldOptions,
                code,
                runtime: FunctionRuntime.JS_1_0_0,
            };
        }

        if (runtime === RESOLVER_RUNTIME.VTL) {
            const { requestMappingTemplate, responseMappingTemplate } = instance as VtlResolver;
            resolvableFieldOptions = {
                ...resolvableFieldOptions,
                requestMappingTemplate,
                responseMappingTemplate,
            };
        }

        // If any functions are defined, then add them as well
        const { functions: functionNames } = resolverInfo;

        if (functionNames.length > 0) {
            const pipelineConfig: AppsyncFunction[] = [];

            for (const functionName of functionNames) {
                const match = functions[functionName];

                if (!match) {
                    throw new Error(`Unable to find function '${functionName}'.`);
                }

                pipelineConfig.push(match);
            }

            resolvableFieldOptions = {
                ...resolvableFieldOptions,
                pipelineConfig,
            };
        } else {
            // If a pipeline resolver is not configured, then include the data source
            const { dataSource: dataSourceName } = instance;

            if (!dataSourceName) {
                throw new Error(`A data source is required for resolver '${resolverType.name}'.`);
            }

            const dataSource = dataSources[dataSourceName];

            if (!dataSource) {
                throw new Error(`Unable to find data source '${dataSourceName}'.`);
            }

            resolvableFieldOptions = {
                ...resolvableFieldOptions,
                dataSource,
            };
        }

        return new ResolvableField(resolvableFieldOptions);
    }

    // #region Directive Factories

    private createApiKeyDirective(): Directive {
        return Directive.apiKey();
    }

    private createCognitoDirective(context: DirectiveInfo['context']): Directive {
        const groups = context!.groups as string[];
        return Directive.cognito(...groups);
    }

    private createCustomDirective(context: DirectiveInfo['context']): Directive {
        const statement = context!.statement as string;
        return Directive.custom(statement);
    }

    private createIamDirective(): Directive {
        return Directive.iam();
    }

    private createLambdaDirective(): Directive {
        return Directive.custom(LAMBDA_DIRECTIVE_STATEMENT);
    }

    private createOidcDirective(): Directive {
        return Directive.oidc();
    }

    private createSubscribeDirective(context: DirectiveInfo['context']): Directive {
        const mutations = context!.mutations as string[];
        return Directive.subscribe(...mutations);
    }

    // #endregion

    // #region Type Factories

    private createEnumType(typeInfo: TypeInfo): EnumType {
        const { typeName } = typeInfo;

        // A class decorated as an enum type will define properties for each enum value
        // Get those properties and map as a string array
        // Note that the value used for each property is ignored (purely to keep typescript happy)
        const fieldInfos = TypeReflector.getFieldInfos(typeInfo);

        return new EnumType(typeName, {
            definition: fieldInfos.map(({ propertyInfo: { propertyName } }) => propertyName),
        });
    }

    private createInputType(typeInfo: TypeInfo): InputType {
        const { typeName } = typeInfo;

        // An input type requires directives and a definition of fields
        const directives = this.createDirectives(typeInfo);
        const definition = this.createFields(typeInfo);

        return new InputType(typeName, {
            directives,
            definition,
        });
    }

    private createInterfaceType(typeInfo: TypeInfo): InterfaceType {
        const { typeName } = typeInfo;

        // An interface type requires directives and a definition of fields
        const directives = this.createDirectives(typeInfo);
        const definition = this.createFields(typeInfo);

        return new InterfaceType(typeName, {
            directives,
            definition,
        });
    }

    private createObjectType(typeInfo: TypeInfo): ObjectType {
        const { typeName } = typeInfo;

        // An object type requires directives and a definition of fields
        const directives = this.createDirectives(typeInfo);
        const definition = this.createFields(typeInfo);

        // An object type can also implement interfaces
        // Get any defined types and map to their intermediate types
        const typeInfos = TypeReflector.getMetadataTypeInfos(METADATA.TYPE.OBJECT_TYPES, typeInfo);

        return new ObjectType(typeName, {
            directives,
            definition,
            interfaceTypes:
                typeInfos.length === 0 ? undefined : typeInfos.map((typeInfo) => this.createIntermediateType(typeInfo)),
        });
    }

    private createUnionType(typeInfo: TypeInfo): UnionType {
        const { typeName } = typeInfo;

        // A union type decorator will define the types to use
        // Get those associated types and map to their intermediate types
        const typeInfos = TypeReflector.getMetadataTypeInfos(METADATA.TYPE.UNION_TYPES, typeInfo);

        return new UnionType(typeName, {
            definition: typeInfos.map((typeInfo) => this.createIntermediateType(typeInfo)),
        });
    }

    // #endregion
}
