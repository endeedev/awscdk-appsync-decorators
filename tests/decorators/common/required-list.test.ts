import { METADATA } from '@/constants';
import { RequiredList } from '@/decorators';

describe('Decorator: Required List', () => {
    describe('@RequiredList()', () => {
        class TestType {
            @RequiredList()
            prop = 0;
        }

        test(`should set '${METADATA.COMMON.REQUIRED_LIST}' to true`, () => {
            const value = Reflect.getMetadata(METADATA.COMMON.REQUIRED_LIST, TestType.prototype, 'prop');
            expect(value).toBe(true);
        });
    });
});
