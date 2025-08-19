import { Code } from 'aws-cdk-lib/aws-appsync';

import { RESOLVER_RUNTIME } from '@/constants';
import { JsResolver } from '@/resolvers';

describe('Resolvers: JS Resolver', () => {
    describe('constructor()', () => {
        class TestResolver extends JsResolver {
            dataSource = '';
            code = Code.fromInline('// CODE');
        }

        test(`should set runtime to '${RESOLVER_RUNTIME.JS}'`, () => {
            const resolver = new TestResolver();
            expect(resolver.runtime).toBe(RESOLVER_RUNTIME.JS);
        });
    });
});
