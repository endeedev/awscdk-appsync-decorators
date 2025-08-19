import { DIRECTIVE_ID, METADATA } from '@/constants';
import { Custom, Iam } from '@/decorators';

describe('Decorator: IAM', () => {
    describe('@Iam()', () => {
        @Iam()
        @Custom('')
        class TestType {
            @Iam()
            @Custom('')
            prop = 0;
        }

        test(`should set '${METADATA.DIRECTIVE.IDS}' to [${DIRECTIVE_ID.IAM}, ${DIRECTIVE_ID.CUSTOM}] for type`, () => {
            const ids = Reflect.getMetadata(METADATA.DIRECTIVE.IDS, TestType);

            expect(ids).toHaveLength(2);
            expect(ids).toContain(DIRECTIVE_ID.IAM);
            expect(ids).toContain(DIRECTIVE_ID.CUSTOM);
        });

        test(`should set '${METADATA.DIRECTIVE.IDS}' to [${DIRECTIVE_ID.IAM}, ${DIRECTIVE_ID.CUSTOM}] for property`, () => {
            const ids = Reflect.getMetadata(METADATA.DIRECTIVE.IDS, TestType.prototype, 'prop');

            expect(ids).toHaveLength(2);
            expect(ids).toContain(DIRECTIVE_ID.IAM);
            expect(ids).toContain(DIRECTIVE_ID.CUSTOM);
        });
    });
});
