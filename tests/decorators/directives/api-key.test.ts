import { DIRECTIVE_ID, METADATA } from '@/constants';
import { ApiKey } from '@/decorators';

describe('Decorator: API Key', () => {
    describe('@ApiKey()', () => {
        @ApiKey()
        class TestType {
            @ApiKey()
            prop = 0;
        }

        test(`should set '${METADATA.DIRECTIVE.ID}' to '${DIRECTIVE_ID.APIKEY}' for class`, () => {
            const id = Reflect.getMetadata(METADATA.DIRECTIVE.ID, TestType);
            expect(id).toBe(DIRECTIVE_ID.APIKEY);
        });

        test(`should set '${METADATA.DIRECTIVE.ID}' to '${DIRECTIVE_ID.APIKEY}' for property`, () => {
            const id = Reflect.getMetadata(METADATA.DIRECTIVE.ID, TestType.prototype, 'prop');
            expect(id).toBe(DIRECTIVE_ID.APIKEY);
        });
    });
});
