import { TypeInfo } from './type-info';

export interface PropertyInfo {
    readonly propertyName: string;
    readonly returnTypeInfo: TypeInfo;
    readonly declaringTypeInfo: TypeInfo;
}
