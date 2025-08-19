import { Required } from '@/decorators';
import { Scalar } from '@/types';

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
