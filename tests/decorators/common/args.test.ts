import { METADATA } from '@/constants';
import { Args } from '@/decorators';

describe('Decorator: Args', () => {
    describe('@Args(type)', () => {
        class TestArgs {}

        class TestType {
            @Args(TestArgs)
            prop = 0;
        }

        test(`should set '${METADATA.COMMON.ARGS}' to [${TestArgs.name}]`, () => {
            const value = Reflect.getMetadata(METADATA.COMMON.ARGS, TestType.prototype, 'prop');
            expect(value).toEqual(TestArgs);
        });
    });
});
