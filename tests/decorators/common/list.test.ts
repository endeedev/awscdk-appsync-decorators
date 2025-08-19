import { METADATA } from '@/constants';
import { List } from '@/decorators';

describe('Decorator: List', () => {
    describe('@List()', () => {
        class SchemaType {
            @List()
            prop = 0;
        }

        test(`should set '${METADATA.COMMON.LIST}' to true`, () => {
            const value = Reflect.getMetadata(METADATA.COMMON.LIST, SchemaType.prototype, 'prop');
            expect(value).toBe(true);
        });
    });
});
