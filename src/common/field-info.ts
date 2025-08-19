import { ArgInfo } from './arg-info';
import { ModifierInfo } from './modifier-info';
import { PropertyInfo } from './property-info';

export interface FieldInfo {
    readonly property: PropertyInfo;
    readonly args: ArgInfo[];
    readonly modifiers: ModifierInfo;
}
