import { Code } from 'aws-cdk-lib/aws-appsync';

import { JsOperation } from '@/resolvers';

import { DATABASE_DATA_SOURCE } from '../constants';

export class BeerResolver extends JsOperation {
    dataSourceName = DATABASE_DATA_SOURCE;
    code = Code.fromInline('// Get single beer');
}
