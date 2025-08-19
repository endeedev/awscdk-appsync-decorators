import { EnumType } from '@/decorators';
import { Scalar } from '@/types';

@EnumType()
export class Color {
    LIGHT = Scalar.STRING;
    AMBER = Scalar.STRING;
    DARK = Scalar.STRING;
}
