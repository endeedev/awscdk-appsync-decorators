import { MappingTemplate } from 'aws-cdk-lib/aws-appsync';

import { RESOLVER_RUNTIME } from '@/constants';
import { VtlResolver } from '@/resolvers';

describe('Resolvers: VTL Resolver', () => {
    describe('constructor()', () => {
        class TestResolver extends VtlResolver {
            requestMappingTemplate = MappingTemplate.fromString('# REQUEST');
            responseMappingTemplate = MappingTemplate.fromString('# RESPONSE');
        }

        test(`should set runtime to '${RESOLVER_RUNTIME.VTL}'`, () => {
            const resolver = new TestResolver();
            expect(resolver.runtime).toBe(RESOLVER_RUNTIME.VTL);
        });
    });
});
