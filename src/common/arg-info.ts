import { ModifierInfo } from './modifier-info';
import { PropertyInfo } from './property-info';

export interface ArgInfo {
    readonly propertyInfo: PropertyInfo;
    readonly modifierInfo: ModifierInfo;
}
