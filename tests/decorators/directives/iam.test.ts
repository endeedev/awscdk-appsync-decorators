import { DIRECTIVE_ID, METADATA } from '@/constants';
import { Iam } from '@/decorators';

describe('Decorator: IAM', () => {
    describe('@Iam()', () => {
        @Iam()
        class TestType {
            @Iam()
            prop = 0;
        }

        test(`should set '${METADATA.DIRECTIVE.ID}' to '${DIRECTIVE_ID.IAM}' for class`, () => {
            const id = Reflect.getMetadata(METADATA.DIRECTIVE.ID, TestType);
            expect(id).toBe(DIRECTIVE_ID.IAM);
        });

        test(`should set '${METADATA.DIRECTIVE.ID}' to '${DIRECTIVE_ID.IAM}' for property`, () => {
            const id = Reflect.getMetadata(METADATA.DIRECTIVE.ID, TestType.prototype, 'prop');
            expect(id).toBe(DIRECTIVE_ID.IAM);
        });
    });
});
