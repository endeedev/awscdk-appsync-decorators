import { faker } from '@faker-js/faker';

import { METADATA, TYPE_ID } from '@/constants';
import { ObjectType } from '@/decorators';

describe('Decorator: Object Type', () => {
    class TestType1 {}
    class TestType2 {}

    const TYPE_NAME = faker.word.sample();
    const TYPE_NAMES = [TestType1.name, TestType2.name].join(', ');

    describe('@ObjectType()', () => {
        @ObjectType()
        class TestType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.OBJECT}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestType);
            expect(id).toBe(TYPE_ID.OBJECT);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TestType.name}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestType);
            expect(name).toBe(TestType.name);
        });

        test(`should set '${METADATA.OBJECT.TYPES}' to []`, () => {
            const types = Reflect.getMetadata(METADATA.OBJECT.TYPES, TestType);
            expect(types).toEqual([]);
        });
    });

    describe('@ObjectType(name)', () => {
        @ObjectType(TYPE_NAME)
        class TestType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.OBJECT}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestType);
            expect(id).toBe(TYPE_ID.OBJECT);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TYPE_NAME}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestType);
            expect(name).toBe(TYPE_NAME);
        });

        test(`should set '${METADATA.OBJECT.TYPES}' to []`, () => {
            const types = Reflect.getMetadata(METADATA.OBJECT.TYPES, TestType);
            expect(types).toEqual([]);
        });
    });

    describe('@ObjectType(types)', () => {
        @ObjectType(TestType1, TestType2)
        class TestType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.OBJECT}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestType);
            expect(id).toBe(TYPE_ID.OBJECT);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TestType.name}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestType);
            expect(name).toBe(TestType.name);
        });

        test(`should set '${METADATA.OBJECT.TYPES}' to [${TYPE_NAMES}]`, () => {
            const types = Reflect.getMetadata(METADATA.OBJECT.TYPES, TestType);
            expect(types).toEqual([TestType1, TestType2]);
        });
    });

    describe('@ObjectType(name, types)', () => {
        @ObjectType(TYPE_NAME, TestType1, TestType2)
        class TestType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.OBJECT}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestType);
            expect(id).toBe(TYPE_ID.OBJECT);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TYPE_NAME}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestType);
            expect(name).toBe(TYPE_NAME);
        });

        test(`should set '${METADATA.OBJECT.TYPES}' to [${TYPE_NAMES}]`, () => {
            const types = Reflect.getMetadata(METADATA.OBJECT.TYPES, TestType);
            expect(types).toEqual([TestType1, TestType2]);
        });
    });
});
