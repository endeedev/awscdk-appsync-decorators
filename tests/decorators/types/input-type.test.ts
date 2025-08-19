import { METADATA, TYPE_ID } from '@/constants';
import { InputType } from '@/decorators';

const INPUT_NAME = 'CustomTestInput';

describe('Decorator: Input Type', () => {
    describe('@InputType()', () => {
        @InputType()
        class TestInputType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.INPUT}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestInputType);
            expect(id).toBe(TYPE_ID.INPUT);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TestInputType.name}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestInputType);
            expect(name).toBe(TestInputType.name);
        });
    });

    describe('@InputType(name)', () => {
        @InputType(INPUT_NAME)
        class TestInputTypeWithName {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.INPUT}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestInputTypeWithName);
            expect(id).toBe(TYPE_ID.INPUT);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${INPUT_NAME}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestInputTypeWithName);
            expect(name).toBe(INPUT_NAME);
        });
    });
});
