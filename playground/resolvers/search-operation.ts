import { MappingTemplate } from 'aws-cdk-lib/aws-appsync';

import { VtlOperation } from '@/resolvers';

import { SEARCH_DATA_SOURCE } from '../constants';

export class SearchOperation extends VtlOperation {
    dataSourceName = SEARCH_DATA_SOURCE;
    requestMappingTemplate = MappingTemplate.fromString('# Query search items');
    responseMappingTemplate = MappingTemplate.fromString('# Map results');
}
