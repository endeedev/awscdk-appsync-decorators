import { Scalar } from '@/common';
import { InterfaceType } from '@/decorators';

@InterfaceType()
export class Suggestion {
    value = Scalar.STRING;
}
