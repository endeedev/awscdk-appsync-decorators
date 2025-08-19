import { DIRECTIVE_ID, METADATA } from '@/constants';
import { ApiKey } from '@/decorators';

describe('Decorator: API Key', () => {
    describe('@ApiKey()', () => {
        @ApiKey()
        class TestType {
            @ApiKey()
            prop = 0;
        }

        test(`should set '${METADATA.DIRECTIVE.ID}' to '${DIRECTIVE_ID.API_KEY}' for class`, () => {
            const id = Reflect.getMetadata(METADATA.DIRECTIVE.ID, TestType);
            expect(id).toBe(DIRECTIVE_ID.API_KEY);
        });

        test(`should set '${METADATA.DIRECTIVE.ID}' to '${DIRECTIVE_ID.API_KEY}' for property`, () => {
            const id = Reflect.getMetadata(METADATA.DIRECTIVE.ID, TestType.prototype, 'prop');
            expect(id).toBe(DIRECTIVE_ID.API_KEY);
        });
    });
});
