import { METADATA, TYPE_ID } from '@/constants';
import { InterfaceType } from '@/decorators';

const INTERFACE_NAME = 'CustomTestInterface';

describe('Decorator: Interface Type', () => {
    describe('@InterfaceType()', () => {
        @InterfaceType()
        class TestInterfaceType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.INTERFACE}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestInterfaceType);
            expect(id).toBe(TYPE_ID.INTERFACE);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TestInterfaceType.name}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestInterfaceType);
            expect(name).toBe(TestInterfaceType.name);
        });
    });

    describe('@InterfaceType(name)', () => {
        @InterfaceType(INTERFACE_NAME)
        class TestInterfaceTypeWithName {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.INTERFACE}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestInterfaceTypeWithName);
            expect(id).toBe(TYPE_ID.INTERFACE);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${INTERFACE_NAME}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestInterfaceTypeWithName);
            expect(name).toBe(INTERFACE_NAME);
        });
    });
});
