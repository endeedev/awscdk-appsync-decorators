import { MappingTemplate } from 'aws-cdk-lib/aws-appsync';

import { RESOLVER_RUNTIME } from '@/constants';

import { OperationBase } from './operation-base';

export abstract class VtlOperation extends OperationBase {
    abstract readonly requestMappingTemplate: MappingTemplate;
    abstract readonly responseMappingTemplate: MappingTemplate;

    constructor() {
        super(RESOLVER_RUNTIME.VTL);
    }
}
