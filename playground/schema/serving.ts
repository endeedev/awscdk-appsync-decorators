import { ObjectType } from '@/decorators';
import { Scalar } from '@/types';

@ObjectType()
export class Serving {
    f = Scalar.FLOAT;
    c = Scalar.FLOAT;
}
