import { METADATA } from '@/constants';
import { Resolver } from '@/decorators';
import { ResolverBase } from '@/resolvers';

import { getName } from '../../helpers';

describe('Decorators: Resolver', () => {
    const RUNTIME = getName();

    class TestResolver extends ResolverBase {
        constructor() {
            super(RUNTIME);
        }
    }

    describe('@Resolver(type)', () => {
        class TestType {
            @Resolver(TestResolver)
            prop = 0;
        }

        test(`should set '${METADATA.COMMON.RESOLVER_TYPE}' to [${TestResolver.name}]`, () => {
            const type = Reflect.getMetadata(METADATA.COMMON.RESOLVER_TYPE, TestType.prototype, 'prop');
            expect(type).toEqual(TestResolver);
        });

        test(`should set '${METADATA.COMMON.RESOLVER_FUNCTIONS}' to []`, () => {
            const functions = Reflect.getMetadata(METADATA.COMMON.RESOLVER_FUNCTIONS, TestType.prototype, 'prop');
            expect(functions).toEqual([]);
        });
    });

    describe('@Resolver(type, functions)', () => {
        const FUNCTION1 = getName();
        const FUNCTION2 = getName();
        const FUNCTIONS = [FUNCTION1, FUNCTION2].join(', ');

        class TestType {
            @Resolver(TestResolver, FUNCTION1, FUNCTION2)
            prop = 0;
        }

        test(`should set '${METADATA.COMMON.RESOLVER_TYPE}' to [${TestResolver.name}]`, () => {
            const type = Reflect.getMetadata(METADATA.COMMON.RESOLVER_TYPE, TestType.prototype, 'prop');
            expect(type).toEqual(TestResolver);
        });

        test(`should set '${METADATA.COMMON.RESOLVER_FUNCTIONS}' to [${FUNCTIONS}]`, () => {
            const functions = Reflect.getMetadata(METADATA.COMMON.RESOLVER_FUNCTIONS, TestType.prototype, 'prop');
            expect(functions).toEqual([FUNCTION1, FUNCTION2]);
        });
    });
});
