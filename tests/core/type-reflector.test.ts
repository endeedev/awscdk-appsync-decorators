import { faker } from '@faker-js/faker';

import { Scalar, Type } from '@/common';
import { TYPE_ID } from '@/constants';
import { TypeReflector } from '@/core';
import { Args, List, ObjectType, Required, RequiredList } from '@/decorators';

describe('Core: Type Reflector', () => {
    describe('getTypeInfo(scalar)', () => {
        const SCALARS = Object.values(Scalar).filter((scalar) => scalar !== Scalar.INTERMEDIATE);
        const SCALAR = faker.helpers.arrayElement(SCALARS);

        test(`should return scalar info for '${SCALAR}'`, () => {
            const typeInfo = TypeReflector.getTypeInfo(SCALAR);
            expect(typeInfo).toEqual({
                typeId: TYPE_ID.SCALAR,
                typeName: SCALAR,
                definitionType: SCALAR,
            });
        });

        test(`should throw if scalar is '${Scalar.INTERMEDIATE}'`, () => {
            expect(() => TypeReflector.getTypeInfo(Scalar.INTERMEDIATE)).toThrow(
                new Error(`Unable to map properties of type '${Scalar.INTERMEDIATE}'.`),
            );
        });
    });

    describe('getTypeInfo(type)', () => {
        const TYPE_NAME = faker.word.sample();

        @ObjectType(TYPE_NAME)
        class TestType {}

        test(`should return type info for '${TestType.name}'`, () => {
            const typeInfo = TypeReflector.getTypeInfo(TestType);
            expect(typeInfo).toEqual({
                typeId: TYPE_ID.OBJECT,
                typeName: TYPE_NAME,
                definitionType: TestType,
            });
        });
    });

    describe('getFieldInfos(type)', () => {
        const getFieldInfo = (type: Type<object>) => {
            const typeInfo = TypeReflector.getTypeInfo(type);
            const fieldInfos = TypeReflector.getFieldInfos(typeInfo);

            const [first] = fieldInfos;
            expect(fieldInfos).toHaveLength(1);

            return {
                typeInfo,
                fieldInfo: first,
            };
        };

        describe('Field', () => {
            test('should return property info', () => {
                @ObjectType()
                class TestType {
                    prop = Scalar.ID;
                }

                const { typeInfo, fieldInfo } = getFieldInfo(TestType);
                expect(fieldInfo.property).toEqual({
                    propertyType: TypeReflector.getTypeInfo(Scalar.ID),
                    propertyName: 'prop',
                    declaringType: typeInfo,
                });
            });

            test('should return isList = true when using @List() decorator', () => {
                @ObjectType()
                class TestType {
                    @List()
                    prop = Scalar.ID;
                }

                const { fieldInfo } = getFieldInfo(TestType);
                expect(fieldInfo.modifiers).toEqual({
                    isList: true,
                    isRequired: false,
                    isRequiredList: false,
                });
            });

            test('should return isList = true when using @RequiredList() decorator', () => {
                @ObjectType()
                class TestType {
                    @RequiredList()
                    prop = Scalar.ID;
                }

                const { fieldInfo } = getFieldInfo(TestType);
                expect(fieldInfo.modifiers).toEqual({
                    isList: true,
                    isRequired: false,
                    isRequiredList: true,
                });
            });

            test('should return isList = true when property is array', () => {
                @ObjectType()
                class TestType {
                    prop1 = [Scalar.ID];
                }

                const { fieldInfo } = getFieldInfo(TestType);
                expect(fieldInfo.modifiers).toEqual({
                    isList: true,
                    isRequired: false,
                    isRequiredList: false,
                });
            });

            test('should return isRequired = true when using @Required() decorator', () => {
                @ObjectType()
                class TestType {
                    @Required()
                    prop = Scalar.ID;
                }

                const { fieldInfo } = getFieldInfo(TestType);
                expect(fieldInfo.modifiers).toEqual({
                    isList: false,
                    isRequired: true,
                    isRequiredList: false,
                });
            });

            test('should return RequiredList = true when using @RequiredList() decorator', () => {
                @ObjectType()
                class TestType {
                    @RequiredList()
                    prop = Scalar.ID;
                }

                const { fieldInfo } = getFieldInfo(TestType);
                expect(fieldInfo.modifiers).toEqual({
                    isList: true,
                    isRequired: false,
                    isRequiredList: true,
                });
            });
        });

        describe('Arg', () => {
            const getArgInfo = (type: Type<object>) => {
                const { fieldInfo } = getFieldInfo(type);

                const [first] = fieldInfo.args;
                expect(fieldInfo.args).toHaveLength(1);

                return first;
            };

            test('should return property info', () => {
                class TestArgs {
                    prop = Scalar.STRING;
                }

                @ObjectType()
                class TestType {
                    @Args(TestArgs)
                    prop = Scalar.ID;
                }

                const argInfo = getArgInfo(TestType);
                expect(argInfo.property).toEqual({
                    propertyType: TypeReflector.getTypeInfo(Scalar.STRING),
                    propertyName: 'prop',
                    declaringType: TypeReflector.getTypeInfo(TestArgs),
                });
            });

            test('should return isList = true when using @List() decorator', () => {
                class TestArgs {
                    @List()
                    prop = Scalar.STRING;
                }

                @ObjectType()
                class TestType {
                    @Args(TestArgs)
                    prop = Scalar.ID;
                }

                const argInfo = getArgInfo(TestType);
                expect(argInfo.modifiers).toEqual({
                    isList: true,
                    isRequired: false,
                    isRequiredList: false,
                });
            });

            test('should return isList = true when using @RequiredList() decorator', () => {
                class TestArgs {
                    @RequiredList()
                    prop = Scalar.STRING;
                }

                @ObjectType()
                class TestType {
                    @Args(TestArgs)
                    prop = Scalar.ID;
                }

                const argInfo = getArgInfo(TestType);
                expect(argInfo.modifiers).toEqual({
                    isList: true,
                    isRequired: false,
                    isRequiredList: true,
                });
            });

            test('should return isList = true when property is array', () => {
                class TestArgs {
                    prop = [Scalar.STRING];
                }

                @ObjectType()
                class TestType {
                    @Args(TestArgs)
                    prop = Scalar.ID;
                }

                const argInfo = getArgInfo(TestType);
                expect(argInfo.modifiers).toEqual({
                    isList: true,
                    isRequired: false,
                    isRequiredList: false,
                });
            });

            test('should return isRequired = true when using @Required() decorator', () => {
                class TestArgs {
                    @Required()
                    prop = Scalar.STRING;
                }

                @ObjectType()
                class TestType {
                    @Args(TestArgs)
                    prop = Scalar.ID;
                }

                const argInfo = getArgInfo(TestType);
                expect(argInfo.modifiers).toEqual({
                    isList: false,
                    isRequired: true,
                    isRequiredList: false,
                });
            });

            test('should return RequiredList = true when using @RequiredList() decorator', () => {
                class TestArgs {
                    @RequiredList()
                    prop = Scalar.STRING;
                }

                @ObjectType()
                class TestType {
                    @Args(TestArgs)
                    prop = Scalar.ID;
                }

                const argInfo = getArgInfo(TestType);
                expect(argInfo.modifiers).toEqual({
                    isList: true,
                    isRequired: false,
                    isRequiredList: true,
                });
            });
        });
    });
});
