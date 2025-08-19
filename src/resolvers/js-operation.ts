import { Code } from 'aws-cdk-lib/aws-appsync';

import { RESOLVER_RUNTIME } from '@/constants';

import { OperationBase } from './operation-base';

export abstract class JsOperation extends OperationBase {
    abstract readonly code: Code;

    constructor() {
        super(RESOLVER_RUNTIME.JS);
    }
}
