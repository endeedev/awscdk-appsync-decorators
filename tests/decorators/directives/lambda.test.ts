import { DIRECTIVE_ID, METADATA } from '@/constants';
import { Lambda } from '@/decorators';

describe('Decorator: Lambda', () => {
    describe('@Lambda()', () => {
        @Lambda()
        class TestType {
            @Lambda()
            prop = 0;
        }

        test(`should set '${METADATA.DIRECTIVE.ID}' to '${DIRECTIVE_ID.LAMBDA}' for class`, () => {
            const id = Reflect.getMetadata(METADATA.DIRECTIVE.ID, TestType);
            expect(id).toBe(DIRECTIVE_ID.LAMBDA);
        });

        test(`should set '${METADATA.DIRECTIVE.ID}' to '${DIRECTIVE_ID.LAMBDA}' for property`, () => {
            const id = Reflect.getMetadata(METADATA.DIRECTIVE.ID, TestType.prototype, 'prop');
            expect(id).toBe(DIRECTIVE_ID.LAMBDA);
        });
    });
});
