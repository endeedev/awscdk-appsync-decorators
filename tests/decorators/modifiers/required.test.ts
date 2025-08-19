import { METADATA } from '@/constants';
import { Required } from '@/decorators';

describe('Decorator: Required', () => {
    describe('@Required()', () => {
        class SchemaType {
            @Required()
            prop = 0;
        }

        test(`should set '${METADATA.MODIFIER.REQUIRED}' to true`, () => {
            const value = Reflect.getMetadata(METADATA.MODIFIER.REQUIRED, SchemaType.prototype, 'prop');
            expect(value).toBe(true);
        });
    });
});
