import { Stack } from 'aws-cdk-lib';
import { Definition, GraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { writeFileSync } from 'fs';

import { Scalar } from '@/common';
import { SchemaBinder } from '@/core';
import { Args, Required, Resolver } from '@/decorators';

import { DATABASE_DATA_SOURCE, SEARCH_DATA_SOURCE } from './constants';
import { BeerOperation } from './resolvers/beer-operation';
import { BeersOperation } from './resolvers/beers-operation';
import { SearchOperation } from './resolvers/search-operation';
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
    @Resolver(BeerOperation)
    beer = Beer;

    @Args(BeersArgs)
    @Resolver(SearchOperation, BeersOperation)
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
const databaseDataSource = api.addNoneDataSource(DATABASE_DATA_SOURCE);
const searchDataSource = api.addNoneDataSource(SEARCH_DATA_SOURCE);

// Bind the schema
binder.addQuery(Query);

binder.addDataSource(databaseDataSource);
binder.addDataSource(searchDataSource);

binder.bindSchema();

// Output the schema
writeFileSync('./playground/schema.json', JSON.stringify(binder.schema, null, 4));
