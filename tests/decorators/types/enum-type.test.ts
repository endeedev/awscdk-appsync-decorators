import { faker } from '@faker-js/faker';

import { METADATA, TYPE_ID } from '@/constants';
import { EnumType } from '@/decorators';

describe('Decorator: Enum Type', () => {
    describe('@EnumType()', () => {
        @EnumType()
        class TestType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.ENUM}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestType);
            expect(id).toBe(TYPE_ID.ENUM);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TestType.name}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestType);
            expect(name).toBe(TestType.name);
        });
    });

    describe('@EnumType(name)', () => {
        const TYPE_NAME = faker.word.sample();

        @EnumType(TYPE_NAME)
        class TestType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.ENUM}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestType);
            expect(id).toBe(TYPE_ID.ENUM);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TYPE_NAME}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestType);
            expect(name).toBe(TYPE_NAME);
        });
    });
});
