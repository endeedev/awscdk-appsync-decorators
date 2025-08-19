import { Scalar } from '@/common';
import { ObjectType } from '@/decorators';

import { Color } from './color';

@ObjectType()
export class Measures {
    abv = Scalar.FLOAT;
    ibu = Scalar.INT;
    calories = Scalar.INT;
    carbs = Scalar.FLOAT;
    color = Color;
}
