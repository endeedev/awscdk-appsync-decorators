import { Duration, Stack } from 'aws-cdk-lib';
import {
    AppsyncFunction,
    BaseDataSource,
    Code,
    FunctionRuntime,
    GraphqlApi,
    MappingTemplate,
    NoneDataSource,
} from 'aws-cdk-lib/aws-appsync';
import {
    CodeFirstSchema,
    Directive,
    EnumType as SchemaEnumType,
    GraphqlType,
    IIntermediateType,
    InputType as SchemaInputType,
    InterfaceType as SchemaInterfaceType,
    ObjectType as SchemaObjectType,
    ResolvableField,
    UnionType as SchemaUnionType,
} from 'awscdk-appsync-utils';

import { Scalar, Type } from '@/common';
import { LAMBDA_DIRECTIVE_STATEMENT, METADATA, TYPE_NAME } from '@/constants';
import { SchemaBinder } from '@/core';
import {
    ApiKey,
    Args,
    Cache,
    Cognito,
    Custom,
    EnumType,
    Iam,
    InputType,
    InterfaceType,
    Lambda,
    List,
    ObjectType,
    Oidc,
    Required,
    Resolver,
    Subscribe,
    UnionType,
} from '@/decorators';
import { JsResolver, VtlResolver } from '@/resolvers';

import { getName, getNames, getNumber } from '../helpers';

describe('Core: Schema Binder', () => {
    const createContext = (setup: (binder: SchemaBinder) => void) => {
        const binder = new SchemaBinder();
        const addQuerySpy = jest.spyOn(binder.schema as CodeFirstSchema, 'addQuery');
        const addMutationSpy = jest.spyOn(binder.schema as CodeFirstSchema, 'addMutation');
        const addSubscriptionSpy = jest.spyOn(binder.schema as CodeFirstSchema, 'addSubscription');
        const addTypeSpy = jest.spyOn(binder.schema as CodeFirstSchema, 'addType');

        setup(binder);

        return {
            binder,
            addQuerySpy,
            addMutationSpy,
            addSubscriptionSpy,
            addTypeSpy,
        };
    };

    describe('Directives', () => {
        const assertDirective = (query: Type<object>, directive: Directive) => {
            const { binder, addQuerySpy } = createContext((binder) => {
                binder.addQuery(query);
            });

            addQuerySpy.mockImplementationOnce((fieldName, field) => {
                const directives = field.fieldOptions!.directives;

                expect(directives).toEqual([directive]);

                return new SchemaObjectType(fieldName, {
                    definition: {},
                });
            });

            binder.bindSchema();

            expect(addQuerySpy).toHaveBeenCalledTimes(1);
        };

        test('should create api key directive', () => {
            class Query {
                @ApiKey()
                prop = Scalar.ID;
            }

            assertDirective(Query, Directive.apiKey());
        });

        test('should create cognito directive', () => {
            const GROUP = getName();

            class Query {
                @Cognito(GROUP)
                prop = Scalar.ID;
            }

            assertDirective(Query, Directive.cognito(GROUP));
        });

        test('should create custom directive', () => {
            const STATEMENT = getName();

            class Query {
                @Custom(STATEMENT)
                prop = Scalar.ID;
            }

            assertDirective(Query, Directive.custom(STATEMENT));
        });

        test('should create iam directive', () => {
            class Query {
                @Iam()
                prop = Scalar.ID;
            }

            assertDirective(Query, Directive.iam());
        });

        test('should create lambda directive', () => {
            class Query {
                @Lambda()
                prop = Scalar.ID;
            }

            assertDirective(Query, Directive.custom(LAMBDA_DIRECTIVE_STATEMENT));
        });

        test('should create oidc directive', () => {
            class Query {
                @Oidc()
                prop = Scalar.ID;
            }

            assertDirective(Query, Directive.oidc());
        });

        test('should create subscribe directive', () => {
            const MUTATION = getName();

            class Query {
                @Subscribe(MUTATION)
                prop = Scalar.ID;
            }

            assertDirective(Query, Directive.subscribe(MUTATION));
        });

        test('should throw if directive factory is not found', () => {
            const directiveId = getName();

            class Query {
                prop = Scalar.ID;
            }

            const { binder } = createContext((binder) => {
                binder.addQuery(Query);
            });

            // Override the property decorator metadata
            Reflect.defineMetadata(METADATA.DIRECTIVE.IDS, [directiveId], Query.prototype, 'prop');

            expect(() => binder.bindSchema()).toThrow(
                new Error(`Unable to create directive of type '${directiveId}'.`),
            );
        });
    });

    describe('Types', () => {
        const assertIntermediateType = (
            query: Type<object>,
            mutation: Type<object>,
            subscription: Type<object>,
            intermediateType: IIntermediateType,
        ) => {
            const { binder, addQuerySpy, addMutationSpy, addSubscriptionSpy, addTypeSpy } = createContext((binder) => {
                binder.addQuery(query);
                binder.addMutation(mutation);
                binder.addSubscription(subscription);
            });

            binder.bindSchema();

            expect(addQuerySpy).toHaveBeenCalledTimes(1);
            expect(addMutationSpy).toHaveBeenCalledTimes(1);
            expect(addSubscriptionSpy).toHaveBeenCalledTimes(1);

            expect(addTypeSpy).toHaveBeenCalledWith(intermediateType);
        };

        test('should create enum type', () => {
            @EnumType()
            class TestType {
                VALUE = Scalar.ID;
            }

            class Query {
                prop = TestType;
            }

            class Mutation {
                prop = TestType;
            }

            class Subscription {
                prop = TestType;
            }

            assertIntermediateType(
                Query,
                Mutation,
                Subscription,
                new SchemaEnumType(TestType.name, {
                    definition: ['VALUE'],
                }),
            );
        });

        test('should create input type', () => {
            @InputType()
            class TestType {
                @List()
                @Required()
                prop = Scalar.STRING;
            }

            class Query {
                prop = TestType;
            }

            class Mutation {
                prop = TestType;
            }

            class Subscription {
                prop = TestType;
            }

            assertIntermediateType(
                Query,
                Mutation,
                Subscription,
                new SchemaInputType(TestType.name, {
                    definition: {
                        prop: new ResolvableField({
                            directives: [],
                            returnType: GraphqlType.string({
                                isList: true,
                                isRequired: true,
                            }),
                        }),
                    },
                    directives: [],
                }),
            );
        });

        test('should create interface type', () => {
            @InterfaceType()
            class TestType {
                @List()
                @Required()
                prop = Scalar.STRING;
            }

            class Query {
                prop = TestType;
            }

            class Mutation {
                prop = TestType;
            }

            class Subscription {
                prop = TestType;
            }

            assertIntermediateType(
                Query,
                Mutation,
                Subscription,
                new SchemaInterfaceType(TestType.name, {
                    definition: {
                        prop: new ResolvableField({
                            directives: [],
                            returnType: GraphqlType.string({
                                isList: true,
                                isRequired: true,
                            }),
                        }),
                    },
                    directives: [],
                }),
            );
        });

        test('should create object type', () => {
            class TestArgs {
                @Required()
                prop = Scalar.STRING;
            }

            @InterfaceType()
            class TestType1 {
                prop = Scalar.STRING;
            }

            @ObjectType(TestType1)
            class TestType2 {
                @List()
                @Required()
                prop = Scalar.STRING;
            }

            class Query {
                @Args(TestArgs)
                prop = TestType2;
            }

            class Mutation {
                @Args(TestArgs)
                prop = TestType2;
            }

            class Subscription {
                @Args(TestArgs)
                prop = TestType2;
            }

            assertIntermediateType(
                Query,
                Mutation,
                Subscription,
                new SchemaObjectType(TestType2.name, {
                    definition: {
                        prop: new ResolvableField({
                            directives: [],
                            returnType: GraphqlType.string({
                                isList: true,
                                isRequired: true,
                            }),
                            args: {
                                prop: GraphqlType.string({
                                    isRequired: true,
                                }),
                            },
                        }),
                    },
                    directives: [],
                    interfaceTypes: [
                        new SchemaInterfaceType(TestType1.name, {
                            definition: {
                                prop: new ResolvableField({
                                    directives: [],
                                    returnType: GraphqlType.string(),
                                }),
                            },
                            directives: [],
                        }),
                    ],
                }),
            );
        });

        test('should create union type', () => {
            @ObjectType()
            class TestType1 {
                @List()
                @Required()
                prop = Scalar.STRING;
            }

            @UnionType(TestType1)
            class TestType2 {}

            class Query {
                prop = TestType2;
            }

            class Mutation {
                prop = TestType2;
            }

            class Subscription {
                prop = TestType2;
            }

            assertIntermediateType(
                Query,
                Mutation,
                Subscription,
                new SchemaUnionType(TestType2.name, {
                    definition: [
                        new SchemaObjectType(TestType1.name, {
                            definition: {
                                prop: new ResolvableField({
                                    directives: [],
                                    returnType: GraphqlType.string({
                                        isList: true,
                                        isRequired: true,
                                    }),
                                }),
                            },
                            directives: [],
                        }),
                    ],
                }),
            );
        });

        test('should throw if type factory is not found', () => {
            const typeId = getName();

            class TestType {}

            class Query {
                prop = TestType;
            }

            const { binder } = createContext((binder) => {
                binder.addQuery(Query);
            });

            // Override the property decorator metadata
            Reflect.defineMetadata(METADATA.TYPE.ID, [typeId], TestType);

            expect(() => binder.bindSchema()).toThrow(new Error(`Unable to create type '${typeId}'.`));
        });

        test('should create types once', () => {
            @InterfaceType()
            class TestType {
                prop = Scalar.STRING;
            }

            class Query {
                prop1 = TestType;
                prop2 = TestType;
                prop3 = TestType;
                prop4 = TestType;
            }

            class Mutation {
                prop1 = TestType;
                prop2 = TestType;
                prop3 = TestType;
                prop4 = TestType;
            }

            class Subscription {
                prop1 = TestType;
                prop2 = TestType;
                prop3 = TestType;
                prop4 = TestType;
            }

            const { binder, addTypeSpy } = createContext((binder) => {
                binder.addQuery(Query);
                binder.addMutation(Mutation);
                binder.addSubscription(Subscription);
            });

            binder.bindSchema();

            // Query, Mutation Subscription, and TestInterface
            expect(addTypeSpy).toHaveBeenCalledTimes(4);
        });
    });

    describe('Resolvers', () => {
        const DATA_SOURCE = getName();
        const MAX_BATCH_SIZE = getNumber();
        const FUNCTION = getName();
        const CODE = Code.fromInline('// CODE');

        class TestJsResolver extends JsResolver {
            dataSource = DATA_SOURCE;
            maxBatchSize = MAX_BATCH_SIZE;
            code = CODE;
        }

        const assertResolver = (
            query: Type<object>,
            assert: (
                context: ReturnType<typeof createContext>,
                dataSource: BaseDataSource,
                appSyncFunction: AppsyncFunction,
            ) => void,
        ) => {
            const context = createContext((binder) => {
                binder.addQuery(query);
            });

            const { binder } = context;

            const stack = new Stack();
            const api = new GraphqlApi(stack, 'TestApi', {
                name: 'TestApi',
                definition: {
                    schema: binder.schema,
                },
            });

            const dataSource = new NoneDataSource(stack, 'TestDataSource', {
                api,
                name: DATA_SOURCE,
            });

            const appSyncFunction = new AppsyncFunction(stack, 'TestFunction', {
                api,
                name: FUNCTION,
                dataSource,
            });

            assert(context, dataSource, appSyncFunction);
        };

        test('should create js resolvable field', () => {
            class Query {
                @Resolver(TestJsResolver)
                prop = Scalar.STRING;
            }

            assertResolver(Query, ({ binder, addTypeSpy }, dataSource) => {
                binder.bindSchema({
                    dataSources: {
                        [DATA_SOURCE]: dataSource,
                    },
                });

                expect(addTypeSpy).toHaveBeenCalledWith(
                    new SchemaObjectType(TYPE_NAME.QUERY, {
                        definition: {
                            prop: new ResolvableField({
                                directives: [],
                                returnType: GraphqlType.string(),
                                dataSource: dataSource,
                                maxBatchSize: MAX_BATCH_SIZE,
                                code: CODE,
                                runtime: FunctionRuntime.JS_1_0_0,
                            }),
                        },
                    }),
                );
            });
        });

        test('should create vtl resolvable field', () => {
            const REQUEST = MappingTemplate.fromString('# REQUEST');
            const RESPONSE = MappingTemplate.fromString('# REQUEST');

            class TestVtlResolver extends VtlResolver {
                dataSource = DATA_SOURCE;
                maxBatchSize = MAX_BATCH_SIZE;
                requestMappingTemplate = REQUEST;
                responseMappingTemplate = RESPONSE;
            }

            class Query {
                @Resolver(TestVtlResolver)
                prop = Scalar.STRING;
            }

            assertResolver(Query, ({ binder, addTypeSpy }, dataSource) => {
                binder.bindSchema({
                    dataSources: {
                        [DATA_SOURCE]: dataSource,
                    },
                });

                expect(addTypeSpy).toHaveBeenCalledWith(
                    new SchemaObjectType(TYPE_NAME.QUERY, {
                        definition: {
                            prop: new ResolvableField({
                                directives: [],
                                returnType: GraphqlType.string(),
                                dataSource: dataSource,
                                maxBatchSize: MAX_BATCH_SIZE,
                                requestMappingTemplate: REQUEST,
                                responseMappingTemplate: RESPONSE,
                            }),
                        },
                    }),
                );
            });
        });

        test('should create resolvable field with pipeline', () => {
            class Query {
                @Resolver(TestJsResolver, FUNCTION)
                prop = Scalar.STRING;
            }

            assertResolver(Query, ({ binder, addTypeSpy }, dataSource, appSyncFunction) => {
                binder.bindSchema({
                    dataSources: {
                        [DATA_SOURCE]: dataSource,
                    },
                    functions: {
                        [FUNCTION]: appSyncFunction,
                    },
                });

                expect(addTypeSpy).toHaveBeenCalledWith(
                    new SchemaObjectType(TYPE_NAME.QUERY, {
                        definition: {
                            prop: new ResolvableField({
                                directives: [],
                                returnType: GraphqlType.string(),
                                dataSource: dataSource,
                                maxBatchSize: MAX_BATCH_SIZE,
                                code: CODE,
                                runtime: FunctionRuntime.JS_1_0_0,
                                pipelineConfig: [appSyncFunction],
                            }),
                        },
                    }),
                );
            });
        });

        test('should throw if data source is not found', () => {
            class Query {
                @Resolver(TestJsResolver)
                prop = Scalar.STRING;
            }

            assertResolver(Query, ({ binder }) => {
                expect(() => binder.bindSchema()).toThrow(new Error(`Unable to find data source '${DATA_SOURCE}'.`));
            });
        });

        test('should throw if function is not found', () => {
            class Query {
                @Resolver(TestJsResolver, FUNCTION)
                prop = Scalar.STRING;
            }

            assertResolver(Query, ({ binder }, dataSource) => {
                expect(() =>
                    binder.bindSchema({
                        dataSources: {
                            [DATA_SOURCE]: dataSource,
                        },
                    }),
                ).toThrow(new Error(`Unable to find function '${FUNCTION}'.`));
            });
        });
    });

    describe('Cache', () => {
        test('should add caching config', () => {
            const TTL = getNumber();
            const KEYS = getNames();
            const DATA_SOURCE = getName();
            const CODE = Code.fromInline('// CODE');

            class TestJsResolver extends JsResolver {
                dataSource = DATA_SOURCE;
                code = CODE;
            }

            class Query {
                @Cache(TTL, ...KEYS)
                @Resolver(TestJsResolver)
                prop = Scalar.STRING;
            }

            const context = createContext((binder) => {
                binder.addQuery(Query);
            });

            const { binder, addTypeSpy } = context;

            const stack = new Stack();
            const api = new GraphqlApi(stack, 'TestApi', {
                name: 'TestApi',
                definition: {
                    schema: binder.schema,
                },
            });

            const dataSource = new NoneDataSource(stack, 'TestDataSource', {
                api,
                name: DATA_SOURCE,
            });

            binder.bindSchema({
                dataSources: {
                    [DATA_SOURCE]: dataSource,
                },
            });

            expect(addTypeSpy).toHaveBeenCalledWith(
                new SchemaObjectType(TYPE_NAME.QUERY, {
                    definition: {
                        prop: new ResolvableField({
                            directives: [],
                            returnType: GraphqlType.string(),
                            dataSource: dataSource,
                            code: CODE,
                            runtime: FunctionRuntime.JS_1_0_0,
                            cachingConfig: {
                                ttl: Duration.seconds(TTL),
                                cachingKeys: KEYS,
                            },
                        }),
                    },
                }),
            );
        });
    });
});
