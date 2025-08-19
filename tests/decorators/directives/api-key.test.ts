import { DIRECTIVE_ID, METADATA } from '@/constants';
import { ApiKey, Custom } from '@/decorators';

describe('Decorator: API Key', () => {
    describe('@ApiKey()', () => {
        @ApiKey()
        @Custom('')
        class TestType {
            @ApiKey()
            @Custom('')
            prop = 0;
        }

        test(`should set '${METADATA.DIRECTIVE.IDS}' to [${DIRECTIVE_ID.API_KEY}, ${DIRECTIVE_ID.CUSTOM}] for type`, () => {
            const ids = Reflect.getMetadata(METADATA.DIRECTIVE.IDS, TestType);

            expect(ids).toHaveLength(2);
            expect(ids).toContain(DIRECTIVE_ID.API_KEY);
            expect(ids).toContain(DIRECTIVE_ID.CUSTOM);
        });

        test(`should set '${METADATA.DIRECTIVE.IDS}' to [${DIRECTIVE_ID.API_KEY}, ${DIRECTIVE_ID.CUSTOM}] for property`, () => {
            const ids = Reflect.getMetadata(METADATA.DIRECTIVE.IDS, TestType.prototype, 'prop');

            expect(ids).toHaveLength(2);
            expect(ids).toContain(DIRECTIVE_ID.API_KEY);
            expect(ids).toContain(DIRECTIVE_ID.CUSTOM);
        });
    });
});
