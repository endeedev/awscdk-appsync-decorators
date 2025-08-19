import { Scalar } from '@/common';
import { ObjectType } from '@/decorators';

@ObjectType()
export class Category {
    primary = Scalar.STRING;
    secondary = [Scalar.STRING];
}
