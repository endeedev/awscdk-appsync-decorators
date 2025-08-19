import { Scalar } from '@/common';
import { InputType } from '@/decorators';

@InputType('FiltersInput')
export class Filters {
    name = Scalar.STRING;
    brewery = Scalar.STRING;
}
