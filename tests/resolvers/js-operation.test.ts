import { Code } from 'aws-cdk-lib/aws-appsync';

import { RESOLVER_RUNTIME } from '@/constants';
import { JsOperation } from '@/resolvers';

describe('Resolvers: JS Operation', () => {
    describe('constructor()', () => {
        class TestOperation extends JsOperation {
            dataSourceName = '';
            code = Code.fromInline('');
        }

        test(`should set runtime to '${RESOLVER_RUNTIME.JS}'`, () => {
            const operation = new TestOperation();
            expect(operation.runtime).toBe(RESOLVER_RUNTIME.JS);
        });
    });
});
