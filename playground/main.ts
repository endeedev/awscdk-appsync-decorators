import { Scalar } from '@/common';
import { SchemaBuilder } from '@/core';
import { Args, Required } from '@/decorators';

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
    beer = Beer;

    @Args(BeersArgs)
    beers = [Beer];
}

// Build the schema
const schema = SchemaBuilder.buildSchema({
    query: Query,
});

console.log(JSON.stringify(schema, undefined, 4));
