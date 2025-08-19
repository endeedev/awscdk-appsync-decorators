import { METADATA, TYPE_ID } from '@/constants';
import { ObjectType } from '@/decorators';

const OBJECT_NAME = 'CustomTestObject';

class TestInterface1 {}
class TestInterface2 {}

describe('Decorator: Object Type', () => {
    describe('@ObjectType()', () => {
        @ObjectType()
        class TestObjectType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.OBJECT}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestObjectType);
            expect(id).toBe(TYPE_ID.OBJECT);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TestObjectType.name}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestObjectType);
            expect(name).toBe(TestObjectType.name);
        });

        test(`should set '${METADATA.OBJECT.TYPES}' to []`, () => {
            const types = Reflect.getMetadata(METADATA.OBJECT.TYPES, TestObjectType);
            expect(types).toEqual([]);
        });
    });

    describe('@ObjectType(name)', () => {
        @ObjectType(OBJECT_NAME)
        class TestObjectTypeWithName {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.OBJECT}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestObjectTypeWithName);
            expect(id).toBe(TYPE_ID.OBJECT);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${OBJECT_NAME}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestObjectTypeWithName);
            expect(name).toBe(OBJECT_NAME);
        });

        test(`should set '${METADATA.OBJECT.TYPES}' to []`, () => {
            const types = Reflect.getMetadata(METADATA.OBJECT.TYPES, TestObjectTypeWithName);
            expect(types).toEqual([]);
        });
    });

    describe('@ObjectType(types)', () => {
        @ObjectType(TestInterface1, TestInterface2)
        class TestObjectTypeWithInterfaces {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.OBJECT}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestObjectTypeWithInterfaces);
            expect(id).toBe(TYPE_ID.OBJECT);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TestObjectTypeWithInterfaces.name}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestObjectTypeWithInterfaces);
            expect(name).toBe(TestObjectTypeWithInterfaces.name);
        });

        test(`should set '${METADATA.OBJECT.TYPES}' to [TestInterface1, TestInterface2]`, () => {
            const types = Reflect.getMetadata(METADATA.OBJECT.TYPES, TestObjectTypeWithInterfaces);
            expect(types).toEqual([TestInterface1, TestInterface2]);
        });
    });

    describe('@ObjectType(name, types)', () => {
        @ObjectType(OBJECT_NAME, TestInterface1, TestInterface2)
        class TestObjectTypeWithNameAndInterfaces {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.OBJECT}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestObjectTypeWithNameAndInterfaces);
            expect(id).toBe(TYPE_ID.OBJECT);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${OBJECT_NAME}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestObjectTypeWithNameAndInterfaces);
            expect(name).toBe(OBJECT_NAME);
        });

        test(`should set '${METADATA.OBJECT.TYPES}' to [TestInterface1, TestInterface2]`, () => {
            const types = Reflect.getMetadata(METADATA.OBJECT.TYPES, TestObjectTypeWithNameAndInterfaces);
            expect(types).toEqual([TestInterface1, TestInterface2]);
        });
    });
});
