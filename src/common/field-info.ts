import { ArgInfo } from './arg-info';
import { ModifierInfo } from './modifier-info';
import { PropertyInfo } from './property-info';

export interface FieldInfo {
    readonly propertyInfo: PropertyInfo;
    readonly modifierInfo: ModifierInfo;
    readonly argInfos: ArgInfo[];
}
