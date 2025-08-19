import { ObjectType } from '@/decorators';
import { Scalar } from '@/types';

import { Color } from './color';

@ObjectType()
export class Measures {
    abv = Scalar.FLOAT;
    ibu = Scalar.INT;
    calories = Scalar.INT;
    carbs = Scalar.FLOAT;
    color = Color;
}
