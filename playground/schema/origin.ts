import { Scalar } from '@/common';
import { ObjectType } from '@/decorators';

@ObjectType()
export class Origin {
    country = Scalar.STRING;
    region = Scalar.STRING;
}
