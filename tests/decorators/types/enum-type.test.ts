import { METADATA, TYPE_ID } from '@/constants';
import { EnumType } from '@/decorators';

const ENUM_NAME = 'CustomTestEnum';

describe('Decorator: Enum Type', () => {
    describe('@EnumType()', () => {
        @EnumType()
        class TestEnumType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.ENUM}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestEnumType);
            expect(id).toBe(TYPE_ID.ENUM);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TestEnumType.name}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestEnumType);
            expect(name).toBe(TestEnumType.name);
        });
    });

    describe('@EnumType(name)', () => {
        @EnumType(ENUM_NAME)
        class TestEnumTypeWithName {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.ENUM}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestEnumTypeWithName);
            expect(id).toBe(TYPE_ID.ENUM);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${ENUM_NAME}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestEnumTypeWithName);
            expect(name).toBe(ENUM_NAME);
        });
    });
});
