import { ObjectType } from '@/decorators';
import { Scalar } from '@/types';

@ObjectType()
export class Origin {
    country = Scalar.STRING;
    region = Scalar.STRING;
}
