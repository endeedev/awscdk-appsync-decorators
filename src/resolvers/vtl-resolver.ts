import { MappingTemplate } from 'aws-cdk-lib/aws-appsync';

import { RESOLVER_RUNTIME } from '@/constants';

import { ResolverBase } from './resolver-base';

export abstract class VtlResolver extends ResolverBase {
    abstract readonly requestMappingTemplate: MappingTemplate;
    abstract readonly responseMappingTemplate: MappingTemplate;

    constructor() {
        super(RESOLVER_RUNTIME.VTL);
    }
}
