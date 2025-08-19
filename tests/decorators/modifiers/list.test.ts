import { METADATA } from '@/constants';
import { List } from '@/decorators';

describe('Decorator: List', () => {
    describe('@List()', () => {
        class SchemaType {
            @List()
            prop = 0;
        }

        test(`should set '${METADATA.MODIFIER.LIST}' to true`, () => {
            const value = Reflect.getMetadata(METADATA.MODIFIER.LIST, SchemaType.prototype, 'prop');
            expect(value).toBe(true);
        });
    });
});
