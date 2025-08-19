import { METADATA } from '@/constants';
import { Required } from '@/decorators';

describe('Decorators: Required', () => {
    describe('@Required()', () => {
        class TestType {
            @Required()
            prop = 0;
        }

        test(`should set '${METADATA.COMMON.REQUIRED}' to true`, () => {
            const value = Reflect.getMetadata(METADATA.COMMON.REQUIRED, TestType.prototype, 'prop');
            expect(value).toBe(true);
        });
    });
});
