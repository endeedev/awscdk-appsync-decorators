import { Stack } from 'aws-cdk-lib';
import { AppsyncFunction, Code, Definition, GraphqlApi, MappingTemplate } from 'aws-cdk-lib/aws-appsync';
import { writeFileSync } from 'fs';

import { Scalar } from '@/common';
import { SchemaBinder } from '@/core';
import { Args, Required, Resolver } from '@/decorators';

import { BEERS_FUNCTION, DATABASE_DATA_SOURCE, SEARCH_DATA_SOURCE, SEARCH_FUNCTION } from './constants';
import { BeerResolver } from './resolvers/beer-resolver';
import { BeersResolver } from './resolvers/beers-resolver';
import { Beer } from './schema/beer';
import { Filters } from './schema/filters';

class BeerArgs {
    @Required()
    sku = Scalar.ID;
}

class BeersArgs {
    @Required()
    filters = Filters;
}

export class Query {
    @Args(BeerArgs)
    @Resolver(BeerResolver)
    beer = Beer;

    @Args(BeersArgs)
    @Resolver(BeersResolver, SEARCH_FUNCTION, BEERS_FUNCTION)
    beers = [Beer];
}

// Create the stack and api construct
const stack = new Stack();
const binder = new SchemaBinder();
const api = new GraphqlApi(stack, 'Api', {
    name: 'Playground',
    definition: Definition.fromSchema(binder.schema),
});

// Create the data source constucts
const searchDataSource = api.addNoneDataSource(SEARCH_DATA_SOURCE);
const databaseDataSource = api.addNoneDataSource(DATABASE_DATA_SOURCE);

// Create any pipeline functions
const searchFunction = new AppsyncFunction(stack, SEARCH_FUNCTION, {
    api,
    name: SEARCH_FUNCTION,
    description: SEARCH_FUNCTION,
    dataSource: searchDataSource,
    code: Code.fromInline('// CODE'),
});

const beersFunction = new AppsyncFunction(stack, BEERS_FUNCTION, {
    api,
    name: BEERS_FUNCTION,
    description: BEERS_FUNCTION,
    dataSource: databaseDataSource,
    requestMappingTemplate: MappingTemplate.fromString('# REQUEST'),
    responseMappingTemplate: MappingTemplate.fromString('# RESPONSE'),
});

// Bind the schema
binder.addQuery(Query);

binder.bindSchema();

// Output the schema
writeFileSync('./playground/schema.json', JSON.stringify(binder.schema, null, 4));
