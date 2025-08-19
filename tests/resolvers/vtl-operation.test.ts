import { MappingTemplate } from 'aws-cdk-lib/aws-appsync';

import { RESOLVER_RUNTIME } from '@/constants';
import { VtlOperation } from '@/resolvers';

describe('Resolvers: VTL Operation', () => {
    describe('constructor()', () => {
        class TestOperation extends VtlOperation {
            dataSourceName = '';
            requestMappingTemplate = MappingTemplate.fromString('# REQUEST');
            responseMappingTemplate = MappingTemplate.fromString('# RESPONSE');
        }

        test(`should set runtime to '${RESOLVER_RUNTIME.VTL}'`, () => {
            const operation = new TestOperation();
            expect(operation.runtime).toBe(RESOLVER_RUNTIME.VTL);
        });
    });
});
