import { Code } from 'aws-cdk-lib/aws-appsync';

import { JsOperation } from '@/resolvers';

import { DATABASE_DATA_SOURCE } from '../constants';

export class BeersResolver extends JsOperation {
    dataSourceName = DATABASE_DATA_SOURCE;
    code = Code.fromInline('// Get many beers');
}
