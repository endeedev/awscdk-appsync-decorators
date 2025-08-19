import { DIRECTIVE_ID, METADATA } from '@/constants';
import { Oidc } from '@/decorators';

describe('Decorator: OIDC', () => {
    describe('@Oidc()', () => {
        @Oidc()
        class TestType {
            @Oidc()
            prop = 0;
        }

        test(`should set '${METADATA.DIRECTIVE.ID}' to '${DIRECTIVE_ID.OIDC}' for class`, () => {
            const id = Reflect.getMetadata(METADATA.DIRECTIVE.ID, TestType);
            expect(id).toBe(DIRECTIVE_ID.OIDC);
        });

        test(`should set '${METADATA.DIRECTIVE.ID}' to '${DIRECTIVE_ID.OIDC}' for property`, () => {
            const id = Reflect.getMetadata(METADATA.DIRECTIVE.ID, TestType.prototype, 'prop');
            expect(id).toBe(DIRECTIVE_ID.OIDC);
        });
    });
});
