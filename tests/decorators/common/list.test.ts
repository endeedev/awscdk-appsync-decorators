import { METADATA } from '@/constants';
import { List } from '@/decorators';

describe('Decorators: List', () => {
    describe('@List()', () => {
        class TestType {
            @List()
            prop = 0;
        }

        test(`should set '${METADATA.COMMON.LIST}' to true`, () => {
            const value = Reflect.getMetadata(METADATA.COMMON.LIST, TestType.prototype, 'prop');
            expect(value).toBe(true);
        });
    });
});
