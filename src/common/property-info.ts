import { TypeInfo } from './type-info';

export interface PropertyInfo {
    readonly propertyType: TypeInfo;
    readonly propertyName: string;
    readonly declaringType: TypeInfo;
}
