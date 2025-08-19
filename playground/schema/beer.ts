import { List, ObjectType } from '@/decorators';
import { Scalar } from '@/types';

import { Category } from './category';
import { Measures } from './measures';
import { Origin } from './origin';
import { Serving } from './serving';
import { Suggestions } from './suggestions';

@ObjectType()
export class Beer {
    sku = Scalar.ID;
    type = Scalar.STRING;
    name = Scalar.STRING;
    description = Scalar.STRING;
    active = Scalar.BOOLEAN;
    rating = Scalar.INT;
    brewery = Scalar.STRING;
    origin = Origin;
    category = Category;
    serving = Serving;
    measures = Measures;
    features = [Scalar.STRING];
    notes = [Scalar.STRING];

    @List()
    suggestions = Suggestions;
}
