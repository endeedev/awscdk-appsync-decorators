import { Type } from './type';

export interface TypeInfo {
    readonly typeId: string;
    readonly typeName: string;
    readonly definitionType: Type<object>;
}
