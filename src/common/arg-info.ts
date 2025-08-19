import { ModifierInfo } from './modifier-info';
import { PropertyInfo } from './property-info';

export interface ArgInfo {
    readonly property: PropertyInfo;
    readonly modifiers: ModifierInfo;
}
