import { DIRECTIVE_ID, METADATA } from '@/constants';
import { Custom, Oidc } from '@/decorators';

describe('Decorator: OIDC', () => {
    describe('@Oidc()', () => {
        @Oidc()
        @Custom('')
        class TestType {
            @Oidc()
            @Custom('')
            prop = 0;
        }

        test(`should set '${METADATA.DIRECTIVE.IDS}' to [${DIRECTIVE_ID.OIDC}, ${DIRECTIVE_ID.CUSTOM}] for class`, () => {
            const ids = Reflect.getMetadata(METADATA.DIRECTIVE.IDS, TestType);

            expect(ids).toHaveLength(2);
            expect(ids).toContain(DIRECTIVE_ID.OIDC);
            expect(ids).toContain(DIRECTIVE_ID.CUSTOM);
        });

        test(`should set '${METADATA.DIRECTIVE.IDS}' to [${DIRECTIVE_ID.OIDC}, ${DIRECTIVE_ID.CUSTOM}] for property`, () => {
            const ids = Reflect.getMetadata(METADATA.DIRECTIVE.IDS, TestType.prototype, 'prop');

            expect(ids).toHaveLength(2);
            expect(ids).toContain(DIRECTIVE_ID.OIDC);
            expect(ids).toContain(DIRECTIVE_ID.CUSTOM);
        });
    });
});
