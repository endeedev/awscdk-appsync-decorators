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
import { LAMBDA_DIRECTIVE_STATEMENT } from '@/constants';
import { SchemaBinder } from '@/core';
import {
    ApiKey,
    Args,
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
    UnionType,
} from '@/decorators';

import { getName } from '../helpers';

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
    });

    describe('Types', () => {
        const assertIntermediateType = (
            query: Type<object>,
            mutation: Type<object>,
            intermediateType: IIntermediateType,
        ) => {
            const { binder, addQuerySpy, addMutationSpy, addTypeSpy } = createContext((binder) => {
                binder.addQuery(query);
                binder.addMutation(mutation);
            });

            binder.bindSchema();

            expect(addQuerySpy).toHaveBeenCalledTimes(1);
            expect(addMutationSpy).toHaveBeenCalledTimes(1);

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

            assertIntermediateType(
                Query,
                Mutation,
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

            assertIntermediateType(
                Query,
                Mutation,
                new SchemaInputType(TestType.name, {
                    definition: {
                        prop: new ResolvableField({
                            directives: [],
                            returnType: GraphqlType.string({
                                isList: true,
                                isRequired: true,
                            }),
                            args: undefined,
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

            assertIntermediateType(
                Query,
                Mutation,
                new SchemaInterfaceType(TestType.name, {
                    definition: {
                        prop: new ResolvableField({
                            directives: [],
                            returnType: GraphqlType.string({
                                isList: true,
                                isRequired: true,
                            }),
                            args: undefined,
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

            assertIntermediateType(
                Query,
                Mutation,
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
                                    args: undefined,
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

            assertIntermediateType(
                Query,
                Mutation,
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
                                    args: undefined,
                                }),
                            },
                            directives: [],
                            interfaceTypes: undefined,
                        }),
                    ],
                }),
            );
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

            const { binder, addTypeSpy } = createContext((binder) => {
                binder.addQuery(Query);
                binder.addMutation(Mutation);
            });

            binder.bindSchema();

            // Query, Mutation and TestInterface
            expect(addTypeSpy).toHaveBeenCalledTimes(3);
        });
    });
});
