import { Code, FunctionRuntime } from 'aws-cdk-lib/aws-appsync';

import { FUNCTION_TYPE } from '@/constants';

import { FunctionBase } from './function-base';

export abstract class JsFunction extends FunctionBase {
    abstract readonly runtime: FunctionRuntime;
    abstract readonly code: Code;

    constructor() {
        super(FUNCTION_TYPE.JS);
    }
}
