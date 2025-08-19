import { InputType } from '@/decorators';
import { Scalar } from '@/types';

@InputType('FiltersInput')
export class Filters {
    name = Scalar.STRING;
    brewery = Scalar.STRING;
}
