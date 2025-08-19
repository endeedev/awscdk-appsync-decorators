import { ISchema } from 'aws-cdk-lib/aws-appsync';
import {
    CodeFirstSchema,
    Directive,
    EnumType,
    IIntermediateType,
    InputType,
    InterfaceType,
    ObjectType,
    ResolvableField,
    Type as TypeBase,
    UnionType,
} from 'awscdk-appsync-utils';

import { ArgInfo, DirectiveInfo, GraphqlType, ModifierInfo, PropertyInfo, Type, TypeInfo } from '@/common';
import { DIRECTIVE_ID, LAMBDA_DIRECTIVE_STATEMENT, METADATA, TYPE_ID } from '@/constants';

import { TypeReflector } from './type-reflector';
import { TypeStore } from './type-store';

type DirectiveFactory = (context: DirectiveInfo['context']) => Directive;
type IntermediateTypeFactory = (typeInfo: TypeInfo) => IIntermediateType;

export class SchemaBinder {
    private _schema: CodeFirstSchema;

    private _intermediateTypeStore: TypeStore<IIntermediateType>;

    private _directiveFactories: Record<string, DirectiveFactory>;
    private _intermediateTypeFactories: Record<string, IntermediateTypeFactory>;

    private _query?: Type<object>;
    private _mutation?: Type<object>;

    get schema(): ISchema {
        return this._schema;
    }

    constructor() {
        this._schema = new CodeFirstSchema();

        // Initialize the type store
        this._intermediateTypeStore = new TypeStore<IIntermediateType>();

        // Register the factories
        this._directiveFactories = {
            [DIRECTIVE_ID.API_KEY]: this.createApiKeyDirective.bind(this),
            [DIRECTIVE_ID.COGNITO]: this.createCognitoDirective.bind(this),
            [DIRECTIVE_ID.CUSTOM]: this.createCustomDirective.bind(this),
            [DIRECTIVE_ID.IAM]: this.createIamDirective.bind(this),
            [DIRECTIVE_ID.LAMBDA]: this.createLambdaDirective.bind(this),
            [DIRECTIVE_ID.OIDC]: this.createOidcDirective.bind(this),
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

    bindSchema(): void {
        // Add the query type
        if (this._query) {
            const fields = this.createFields({
                typeId: TYPE_ID.QUERY,
                typeName: 'Query',
                definitionType: this._query as Type<object>,
            });

            for (const [name, field] of Object.entries(fields)) {
                this._schema.addQuery(name, field);
            }
        }

        // Add the mutation type
        if (this._mutation) {
            const fields = this.createFields({
                typeId: TYPE_ID.MUTATION,
                typeName: 'Mutation',
                definitionType: this._mutation as Type<object>,
            });

            for (const [name, field] of Object.entries(fields)) {
                this._schema.addMutation(name, field);
            }
        }
    }

    private createFields(typeInfo: TypeInfo): Record<string, ResolvableField> {
        const fieldInfos = TypeReflector.getFieldInfos(typeInfo);

        // Create resolvable fields for the type field infos
        return fieldInfos.reduce((output, { propertyInfo, modifierInfo, argInfos }) => {
            const { propertyName, returnTypeInfo } = propertyInfo;

            const directives = this.createDirectives(typeInfo, propertyInfo);
            const returnType = this.createType(returnTypeInfo, modifierInfo);
            const args = this.createArgs(argInfos);

            return {
                ...output,
                [propertyName]: new ResolvableField({
                    directives,
                    returnType,
                    args,
                }),
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
        let intermediateType = this._intermediateTypeStore.getType(typeName);

        // If not found, create a definition and add to the store
        if (!intermediateType) {
            const factory = this._intermediateTypeFactories[typeId];

            if (!factory) {
                throw new Error(`Unable to create type '${typeId}'.`);
            }

            intermediateType = factory(typeInfo);

            this._intermediateTypeStore.registerType(typeName, intermediateType);

            // Add the type to the schema definition
            this._schema.addType(intermediateType);
        }

        return intermediateType;
    }

    private createArgs(argInfos: ArgInfo[]): Record<string, GraphqlType> | undefined {
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
