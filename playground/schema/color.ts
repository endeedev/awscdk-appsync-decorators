import { Scalar } from '@/common';
import { EnumType } from '@/decorators';

@EnumType()
export class Color {
    LIGHT = Scalar.STRING;
    AMBER = Scalar.STRING;
    DARK = Scalar.STRING;
}
