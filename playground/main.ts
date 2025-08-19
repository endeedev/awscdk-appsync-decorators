import { Scalar } from '@/common';
import { Arguments, Required } from '@/decorators';

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
    @Arguments(BeerArgs)
    beer = Beer;

    @Arguments(BeersArgs)
    beers = [Beer];
}
