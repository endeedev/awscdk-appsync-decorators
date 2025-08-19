import { METADATA } from '@/constants';
import { RequiredList } from '@/decorators';

describe('Decorator: Required List', () => {
    describe('@RequiredList()', () => {
        class SchemaType {
            @RequiredList()
            prop = 0;
        }

        test(`should set '${METADATA.MODIFIER.REQUIRED_LIST}' to true`, () => {
            const value = Reflect.getMetadata(METADATA.MODIFIER.REQUIRED_LIST, SchemaType.prototype, 'prop');
            expect(value).toBe(true);
        });
    });
});
