import { Code } from 'aws-cdk-lib/aws-appsync';

import { DirectiveInfo, Scalar, Type } from '@/common';
import { DIRECTIVE_ID, METADATA, TYPE_ID } from '@/constants';
import { TypeReflector } from '@/core';
import {
    ApiKey,
    Args,
    Cache,
    Cognito,
    Custom,
    Iam,
    Lambda,
    List,
    ObjectType,
    Oidc,
    Required,
    RequiredList,
    Resolver,
    UnionType,
} from '@/decorators';
import { JsResolver } from '@/resolvers';

import { getName, getNames, getNumber, getScalar, getTypeInfos } from '../helpers';

describe('Core: Type Reflector', () => {
    describe('getTypeInfo(scalar)', () => {
        const SCALAR = getScalar();

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
        const TYPE_NAME = getName();

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

    describe('getFieldInfos(typeInfo)', () => {
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
                class TestType {
                    prop = Scalar.ID;
                }

                const { typeInfo, fieldInfo } = getFieldInfo(TestType);
                expect(fieldInfo.propertyInfo).toEqual({
                    propertyName: 'prop',
                    returnTypeInfo: TypeReflector.getTypeInfo(Scalar.ID),
                    declaringTypeInfo: typeInfo,
                });
            });

            test('should return isList = true when using @List() decorator', () => {
                class TestType {
                    @List()
                    prop = Scalar.ID;
                }

                const { fieldInfo } = getFieldInfo(TestType);
                expect(fieldInfo.modifierInfo).toEqual({
                    isList: true,
                    isRequired: false,
                    isRequiredList: false,
                });
            });

            test('should return isList = true when using @RequiredList() decorator', () => {
                class TestType {
                    @RequiredList()
                    prop = Scalar.ID;
                }

                const { fieldInfo } = getFieldInfo(TestType);
                expect(fieldInfo.modifierInfo).toEqual({
                    isList: true,
                    isRequired: false,
                    isRequiredList: true,
                });
            });

            test('should return isList = true when property is array', () => {
                class TestType {
                    prop1 = [Scalar.ID];
                }

                const { fieldInfo } = getFieldInfo(TestType);
                expect(fieldInfo.modifierInfo).toEqual({
                    isList: true,
                    isRequired: false,
                    isRequiredList: false,
                });
            });

            test('should return isRequired = true when using @Required() decorator', () => {
                class TestType {
                    @Required()
                    prop = Scalar.ID;
                }

                const { fieldInfo } = getFieldInfo(TestType);
                expect(fieldInfo.modifierInfo).toEqual({
                    isList: false,
                    isRequired: true,
                    isRequiredList: false,
                });
            });

            test('should return RequiredList = true when using @RequiredList() decorator', () => {
                class TestType {
                    @RequiredList()
                    prop = Scalar.ID;
                }

                const { fieldInfo } = getFieldInfo(TestType);
                expect(fieldInfo.modifierInfo).toEqual({
                    isList: true,
                    isRequired: false,
                    isRequiredList: true,
                });
            });
        });

        describe('Arg', () => {
            const getArgInfo = (type: Type<object>) => {
                const { fieldInfo } = getFieldInfo(type);

                const [first] = fieldInfo.argInfos;
                expect(fieldInfo.argInfos).toHaveLength(1);

                return first;
            };

            test('should return property info', () => {
                class TestArgs {
                    prop = Scalar.STRING;
                }

                class TestType {
                    @Args(TestArgs)
                    prop = Scalar.ID;
                }

                const argInfo = getArgInfo(TestType);
                expect(argInfo.propertyInfo).toEqual({
                    propertyName: 'prop',
                    returnTypeInfo: TypeReflector.getTypeInfo(Scalar.STRING),
                    declaringTypeInfo: TypeReflector.getTypeInfo(TestArgs),
                });
            });

            test('should return isList = true when using @List() decorator', () => {
                class TestArgs {
                    @List()
                    prop = Scalar.STRING;
                }

                class TestType {
                    @Args(TestArgs)
                    prop = Scalar.ID;
                }

                const argInfo = getArgInfo(TestType);
                expect(argInfo.modifierInfo).toEqual({
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

                class TestType {
                    @Args(TestArgs)
                    prop = Scalar.ID;
                }

                const argInfo = getArgInfo(TestType);
                expect(argInfo.modifierInfo).toEqual({
                    isList: true,
                    isRequired: false,
                    isRequiredList: true,
                });
            });

            test('should return isList = true when property is array', () => {
                class TestArgs {
                    prop = [Scalar.STRING];
                }

                class TestType {
                    @Args(TestArgs)
                    prop = Scalar.ID;
                }

                const argInfo = getArgInfo(TestType);
                expect(argInfo.modifierInfo).toEqual({
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

                class TestType {
                    @Args(TestArgs)
                    prop = Scalar.ID;
                }

                const argInfo = getArgInfo(TestType);
                expect(argInfo.modifierInfo).toEqual({
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

                class TestType {
                    @Args(TestArgs)
                    prop = Scalar.ID;
                }

                const argInfo = getArgInfo(TestType);
                expect(argInfo.modifierInfo).toEqual({
                    isList: true,
                    isRequired: false,
                    isRequiredList: true,
                });
            });
        });
    });

    describe('getMetadataTypeInfos(metadataKey, typeInfo, propertyInfo)', () => {
        class TestMetadataType1 {}
        class TestMetadataType2 {}

        const TYPE_INFOS = getTypeInfos(TestMetadataType1, TestMetadataType2);

        test('should return object type infos', () => {
            @ObjectType(TestMetadataType1, TestMetadataType2)
            class TestType {}

            const typeInfo = TypeReflector.getTypeInfo(TestType);
            const typeInfos = TypeReflector.getMetadataTypeInfos(METADATA.TYPE.OBJECT_TYPES, typeInfo);

            expect(typeInfos).toEqual(TYPE_INFOS);
        });

        test('should return union type infos', () => {
            @UnionType(TestMetadataType1, TestMetadataType2)
            class TestType {}

            const typeInfo = TypeReflector.getTypeInfo(TestType);
            const typeInfos = TypeReflector.getMetadataTypeInfos(METADATA.TYPE.UNION_TYPES, typeInfo);

            expect(typeInfos).toEqual(TYPE_INFOS);
        });

        test('should return empty if no types', () => {
            const METDATA_KEY = getName();

            class TestType {}

            const typeInfo = TypeReflector.getTypeInfo(TestType);
            const typeInfos = TypeReflector.getMetadataTypeInfos(METDATA_KEY, typeInfo);

            expect(typeInfos).toHaveLength(0);
        });
    });

    describe('getMetadataDirectiveInfos(typeInfo, propertyInfo)', () => {
        const GROUP = getName();
        const GROUPS = getNames();
        const STATEMENT = getName();
        const SCALAR = getScalar();

        const assertDirective = (
            directiveId: string,
            directiveInfos: DirectiveInfo[],
            context?: Readonly<Record<string, unknown>>,
        ) => {
            const directiveInfo = directiveInfos.find(({ directiveId: id }) => id === directiveId);

            expect(directiveInfo).not.toBeUndefined();
            expect(directiveInfo!.context).toEqual(context);
        };

        @ApiKey()
        @Cognito(GROUP, ...GROUPS)
        @Custom(STATEMENT)
        @Iam()
        @Lambda()
        @Oidc()
        class TestType {
            @ApiKey()
            @Cognito(GROUP, ...GROUPS)
            @Custom(STATEMENT)
            @Iam()
            @Lambda()
            @Oidc()
            prop = SCALAR;
        }

        test('should return directive infos for type', () => {
            const typeInfo = TypeReflector.getTypeInfo(TestType);
            const directiveInfos = TypeReflector.getMetadataDirectiveInfos(typeInfo);

            expect(directiveInfos).toHaveLength(6);

            assertDirective(DIRECTIVE_ID.API_KEY, directiveInfos);
            assertDirective(DIRECTIVE_ID.IAM, directiveInfos);
            assertDirective(DIRECTIVE_ID.LAMBDA, directiveInfos);
            assertDirective(DIRECTIVE_ID.OIDC, directiveInfos);

            assertDirective(DIRECTIVE_ID.COGNITO, directiveInfos, {
                groups: [GROUP, ...GROUPS],
            });

            assertDirective(DIRECTIVE_ID.CUSTOM, directiveInfos, {
                statement: STATEMENT,
            });
        });

        test('should return directive infos for property', () => {
            const typeInfo = TypeReflector.getTypeInfo(TestType);
            const directiveInfos = TypeReflector.getMetadataDirectiveInfos(typeInfo, {
                propertyName: 'prop',
                returnTypeInfo: TypeReflector.getTypeInfo(SCALAR),
                declaringTypeInfo: typeInfo,
            });

            expect(directiveInfos).toHaveLength(6);

            assertDirective(DIRECTIVE_ID.API_KEY, directiveInfos);
            assertDirective(DIRECTIVE_ID.IAM, directiveInfos);
            assertDirective(DIRECTIVE_ID.LAMBDA, directiveInfos);
            assertDirective(DIRECTIVE_ID.OIDC, directiveInfos);

            assertDirective(DIRECTIVE_ID.COGNITO, directiveInfos, {
                groups: [GROUP, ...GROUPS],
            });

            assertDirective(DIRECTIVE_ID.CUSTOM, directiveInfos, {
                statement: STATEMENT,
            });
        });

        test('should return empty if no directives for type', () => {
            class TestType {}

            const typeInfo = TypeReflector.getTypeInfo(TestType);
            const directiveInfos = TypeReflector.getMetadataDirectiveInfos(typeInfo);

            expect(directiveInfos).toHaveLength(0);
        });

        test('should return empty if no directives for property', () => {
            class TestType {}

            const typeInfo = TypeReflector.getTypeInfo(TestType);
            const directiveInfos = TypeReflector.getMetadataDirectiveInfos(typeInfo, {
                propertyName: 'prop',
                returnTypeInfo: TypeReflector.getTypeInfo(SCALAR),
                declaringTypeInfo: typeInfo,
            });

            expect(directiveInfos).toHaveLength(0);
        });
    });

    describe('getMetadataResolverInfo(typeInfo, propertyInfo)', () => {
        const DATA_SOURCE = getName();
        const MAX_BATCH_SIZE = getNumber();
        const SCALAR = getScalar();
        const FUNCTION1 = getName();
        const FUNCTION2 = getName();

        class TestResolver extends JsResolver {
            dataSource = DATA_SOURCE;
            maxBatchSize = MAX_BATCH_SIZE;
            code = Code.fromInline('// CODE');
        }

        test('should return resolver info', () => {
            class TestType {
                @Resolver(TestResolver, FUNCTION1, FUNCTION2)
                prop = SCALAR;
            }

            const typeInfo = TypeReflector.getTypeInfo(TestType);
            const resolverInfo = TypeReflector.getMetadataResolverInfo(typeInfo, {
                propertyName: 'prop',
                returnTypeInfo: TypeReflector.getTypeInfo(SCALAR),
                declaringTypeInfo: typeInfo,
            });

            expect(resolverInfo).toEqual({
                resolverType: TestResolver,
                functions: [FUNCTION1, FUNCTION2],
            });
        });

        test('should return undefined if no resolver', () => {
            class TestType {
                prop = SCALAR;
            }

            const typeInfo = TypeReflector.getTypeInfo(TestType);
            const resolverInfo = TypeReflector.getMetadataResolverInfo(typeInfo, {
                propertyName: 'prop',
                returnTypeInfo: TypeReflector.getTypeInfo(SCALAR),
                declaringTypeInfo: typeInfo,
            });

            expect(resolverInfo).toBeUndefined();
        });
    });

    describe('getMetadataCacheInfo(typeInfo, propertyInfo)', () => {
        const TTL = getNumber();
        const KEYS = getNames();
        const SCALAR = getScalar();

        test('should return cache info', () => {
            class TestType {
                @Cache(TTL, ...KEYS)
                prop = SCALAR;
            }

            const typeInfo = TypeReflector.getTypeInfo(TestType);
            const cacheInfo = TypeReflector.getMetadataCacheInfo(typeInfo, {
                propertyName: 'prop',
                returnTypeInfo: TypeReflector.getTypeInfo(SCALAR),
                declaringTypeInfo: typeInfo,
            });

            expect(cacheInfo).toEqual({
                ttl: TTL,
                keys: KEYS,
            });
        });

        test('should return undefined if no cache', () => {
            class TestType {
                prop = SCALAR;
            }

            const typeInfo = TypeReflector.getTypeInfo(TestType);
            const cacheInfo = TypeReflector.getMetadataCacheInfo(typeInfo, {
                propertyName: 'prop',
                returnTypeInfo: TypeReflector.getTypeInfo(SCALAR),
                declaringTypeInfo: typeInfo,
            });

            expect(cacheInfo).toBeUndefined();
        });
    });
});
