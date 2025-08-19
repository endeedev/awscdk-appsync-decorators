import { MappingTemplate } from 'aws-cdk-lib/aws-appsync';

import { FUNCTION_TYPE } from '@/constants';

import { FunctionBase } from './function-base';

export abstract class VtlFunction extends FunctionBase {
    abstract readonly requestMappingTemplate: MappingTemplate;
    abstract readonly responseMappingTemplate: MappingTemplate;

    constructor() {
        super(FUNCTION_TYPE.VTL);
    }
}
