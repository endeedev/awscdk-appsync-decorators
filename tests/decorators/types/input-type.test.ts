import { METADATA, TYPE_ID } from '@/constants';
import { InputType } from '@/decorators';

import { getName } from '../../helpers';

describe('Decorator: Input Type', () => {
    describe('@InputType()', () => {
        @InputType()
        class TestType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.INPUT}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestType);
            expect(id).toBe(TYPE_ID.INPUT);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TestType.name}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestType);
            expect(name).toBe(TestType.name);
        });
    });

    describe('@InputType(name)', () => {
        const TYPE_NAME = getName();

        @InputType(TYPE_NAME)
        class TestType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.INPUT}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestType);
            expect(id).toBe(TYPE_ID.INPUT);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TYPE_NAME}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestType);
            expect(name).toBe(TYPE_NAME);
        });
    });
});
