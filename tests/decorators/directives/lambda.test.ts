import { DIRECTIVE_ID, METADATA } from '@/constants';
import { Custom, Lambda } from '@/decorators';

describe('Decorators: Lambda', () => {
    describe('@Lambda()', () => {
        @Lambda()
        @Custom('')
        class TestType {
            @Lambda()
            @Custom('')
            prop = 0;
        }

        test(`should set '${METADATA.DIRECTIVE.IDS}' to [${DIRECTIVE_ID.LAMBDA}, ${DIRECTIVE_ID.CUSTOM}] for type`, () => {
            const ids = Reflect.getMetadata(METADATA.DIRECTIVE.IDS, TestType);

            expect(ids).toHaveLength(2);
            expect(ids).toContain(DIRECTIVE_ID.LAMBDA);
            expect(ids).toContain(DIRECTIVE_ID.CUSTOM);
        });

        test(`should set '${METADATA.DIRECTIVE.IDS}' to [${DIRECTIVE_ID.LAMBDA}, ${DIRECTIVE_ID.CUSTOM}] for property`, () => {
            const ids = Reflect.getMetadata(METADATA.DIRECTIVE.IDS, TestType.prototype, 'prop');

            expect(ids).toHaveLength(2);
            expect(ids).toContain(DIRECTIVE_ID.LAMBDA);
            expect(ids).toContain(DIRECTIVE_ID.CUSTOM);
        });
    });
});
