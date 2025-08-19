import {
    CodeFirstSchema,
    EnumType as SchemaEnumType,
    InputType as SchemaInputType,
    InterfaceType as SchemaInterfaceType,
    ObjectType as SchemaObjectType,
    ResolvableField,
    Type,
    UnionType as SchemaUnionType,
} from 'awscdk-appsync-utils';

import { GraphqlType, Scalar } from '@/common';
import { TypeFactory } from '@/core';
import { Args, EnumType, InputType, InterfaceType, ObjectType, UnionType } from '@/decorators';

describe('Core: Type Factory', () => {
    describe('createRootType(typeId, type, schema)', () => {
        test('should create root type with scalar', () => {
            const cache = {};
            const schema = new CodeFirstSchema();
            const factory = new TypeFactory(cache);

            class TestQuery {
                prop = Scalar.ID;
            }

            const { fields } = factory.createRootType('test', TestQuery, schema);

            expect(cache).toEqual({});

            expect(fields).toEqual({
                prop: new ResolvableField({
                    returnType: GraphqlType.id(),
                }),
            });
        });

        test('should create root type with enum', () => {
            const cache = {};
            const schema = new CodeFirstSchema();
            const factory = new TypeFactory(cache);

            @EnumType()
            class TestEnum {
                VALUE1 = Scalar.STRING;
            }

            class TestQuery {
                prop = TestEnum;
            }

            const { fields } = factory.createRootType('test', TestQuery, schema);
            const enumType = new SchemaEnumType('TestEnum', {
                definition: ['VALUE1'],
            });

            expect(cache).toEqual({
                TestEnum: enumType,
            });

            expect(fields).toEqual({
                prop: new ResolvableField({
                    returnType: new GraphqlType(Type.INTERMEDIATE, {
                        intermediateType: enumType,
                    }),
                }),
            });
        });

        test('should create root type with object', () => {
            const cache = {};
            const schema = new CodeFirstSchema();
            const factory = new TypeFactory(cache);

            @InterfaceType()
            class TestInterface {
                id = Scalar.ID;
            }

            @ObjectType(TestInterface)
            class TestObject {
                name = Scalar.STRING;
            }

            class TestQuery {
                prop = TestObject;
            }

            const { fields } = factory.createRootType('test', TestQuery, schema);

            const interfaceType = new SchemaInterfaceType('TestInterface', {
                definition: {
                    id: new ResolvableField({
                        returnType: GraphqlType.id(),
                    }),
                },
            });

            const objectType = new SchemaObjectType('TestObject', {
                definition: {
                    name: new ResolvableField({
                        returnType: GraphqlType.string(),
                    }),
                },
                interfaceTypes: [interfaceType],
            });

            expect(cache).toEqual({
                TestInterface: interfaceType,
                TestObject: objectType,
            });

            expect(fields).toEqual({
                prop: new ResolvableField({
                    returnType: new GraphqlType(Type.INTERMEDIATE, {
                        intermediateType: objectType,
                    }),
                }),
            });
        });

        test('should create root type with union', () => {
            const cache = {};
            const schema = new CodeFirstSchema();
            const factory = new TypeFactory(cache);

            @ObjectType()
            class TestObject {
                id = Scalar.ID;
            }

            @UnionType(TestObject)
            class TestUnion {}

            class TestQuery {
                prop = TestUnion;
            }

            const { fields } = factory.createRootType('test', TestQuery, schema);

            const objectType = new SchemaObjectType('TestObject', {
                definition: {
                    id: new ResolvableField({
                        returnType: GraphqlType.id(),
                    }),
                },
            });

            const unionType = new SchemaUnionType('TestUnion', {
                definition: [objectType],
            });

            expect(cache).toEqual({
                TestObject: objectType,
                TestUnion: unionType,
            });

            expect(fields).toEqual({
                prop: new ResolvableField({
                    returnType: new GraphqlType(Type.INTERMEDIATE, {
                        intermediateType: unionType,
                    }),
                }),
            });
        });

        test('should create root type with input', () => {
            const cache = {};
            const schema = new CodeFirstSchema();
            const factory = new TypeFactory(cache);

            @InputType()
            class TestInput {
                id = Scalar.ID;
            }

            class TestArgs {
                input = TestInput;
            }

            class TestQuery {
                @Args(TestArgs)
                prop = Scalar.ID;
            }

            const { fields } = factory.createRootType('test', TestQuery, schema);

            const inputType = new SchemaInputType('TestInput', {
                definition: {
                    id: new ResolvableField({
                        returnType: GraphqlType.id(),
                    }),
                },
            });

            expect(cache).toEqual({
                TestInput: inputType,
            });

            expect(fields).toEqual({
                prop: new ResolvableField({
                    returnType: GraphqlType.id(),
                    args: {
                        input: new GraphqlType(Type.INTERMEDIATE, {
                            intermediateType: inputType,
                        }),
                    },
                }),
            });
        });
    });
});
