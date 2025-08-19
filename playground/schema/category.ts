import { ObjectType } from '@/decorators';
import { Scalar } from '@/types';

@ObjectType()
export class Category {
    primary = Scalar.STRING;
    secondary = [Scalar.STRING];
}
