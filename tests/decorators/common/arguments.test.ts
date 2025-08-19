import { METADATA } from '@/constants';
import { Arguments } from '@/decorators';

describe('Decorator: Arguments', () => {
    describe('@Arguments(type)', () => {
        class Args {}

        class SchemaType {
            @Arguments(Args)
            prop = 0;
        }

        test(`should set '${METADATA.COMMON.ARGUMENTS}' to [${Args.name}]`, () => {
            const value = Reflect.getMetadata(METADATA.COMMON.ARGUMENTS, SchemaType.prototype, 'prop');
            expect(value).toEqual(Args);
        });
    });
});
