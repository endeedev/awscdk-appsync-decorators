import { Scalar } from '@/common';
import { ObjectType } from '@/decorators';

@ObjectType()
export class Serving {
    f = Scalar.FLOAT;
    c = Scalar.FLOAT;
}
