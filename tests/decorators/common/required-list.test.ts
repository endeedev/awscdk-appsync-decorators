import { METADATA } from '@/constants';
import { RequiredList } from '@/decorators';

describe('Decorator: Required List', () => {
    describe('@RequiredList()', () => {
        class SchemaType {
            @RequiredList()
            prop = 0;
        }

        test(`should set '${METADATA.COMMON.REQUIRED_LIST}' to true`, () => {
            const value = Reflect.getMetadata(METADATA.COMMON.REQUIRED_LIST, SchemaType.prototype, 'prop');
            expect(value).toBe(true);
        });
    });
});
