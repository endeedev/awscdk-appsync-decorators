import { METADATA, TYPE_ID } from '@/constants';
import { InterfaceType } from '@/decorators';

import { getName } from '../../helpers';

describe('Decorator: Interface Type', () => {
    describe('@InterfaceType()', () => {
        @InterfaceType()
        class TestType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.INTERFACE}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestType);
            expect(id).toBe(TYPE_ID.INTERFACE);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TestType.name}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestType);
            expect(name).toBe(TestType.name);
        });
    });

    describe('@InterfaceType(name)', () => {
        const TYPE_NAME = getName();

        @InterfaceType(TYPE_NAME)
        class TestType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.INTERFACE}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestType);
            expect(id).toBe(TYPE_ID.INTERFACE);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TYPE_NAME}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestType);
            expect(name).toBe(TYPE_NAME);
        });
    });
});
