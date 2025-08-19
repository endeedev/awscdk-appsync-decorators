import { METADATA } from '@/constants';
import { Args } from '@/decorators';

describe('Decorators: Args', () => {
    describe('@Args(type)', () => {
        class TestArgs {}

        class TestType {
            @Args(TestArgs)
            prop = 0;
        }

        test(`should set '${METADATA.COMMON.ARGS}' to [${TestArgs.name}]`, () => {
            const type = Reflect.getMetadata(METADATA.COMMON.ARGS, TestType.prototype, 'prop');
            expect(type).toEqual(TestArgs);
        });
    });
});
