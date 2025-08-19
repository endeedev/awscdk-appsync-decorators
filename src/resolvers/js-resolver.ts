import { Code } from 'aws-cdk-lib/aws-appsync';

import { RESOLVER_RUNTIME } from '@/constants';

import { ResolverBase } from './resolver-base';

export abstract class JsResolver extends ResolverBase {
    abstract readonly code: Code;

    constructor() {
        super(RESOLVER_RUNTIME.JS);
    }
}
