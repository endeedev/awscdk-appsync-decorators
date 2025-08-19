import { InterfaceType } from '@/decorators';
import { Scalar } from '@/types';

@InterfaceType()
export class Suggestion {
    value = Scalar.STRING;
}
