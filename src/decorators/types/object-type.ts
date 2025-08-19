import { Type } from '@/common';
import { METADATA, TYPE_ID } from '@/constants';

export function ObjectType(): ClassDecorator;
export function ObjectType(...types: Type<object>[]): ClassDecorator;
export function ObjectType(name: string, ...types: Type<object>[]): ClassDecorator;
export function ObjectType(...args: unknown[]): ClassDecorator {
    return (target) => {
        let typeName: string = target.name;
        let typeList: Type<object>[] = [];

        // Parse the args to extract the name and types list (if defined)
        if (args.length > 0) {
            const [first, ...others] = args;

            if (typeof first === 'string') {
                typeName = first as string;
                typeList = others as Type<object>[];
            } else {
                typeList = args as Type<object>[];
            }
        }

        Reflect.defineMetadata(METADATA.TYPE.ID, TYPE_ID.OBJECT, target);
        Reflect.defineMetadata(METADATA.TYPE.NAME, typeName, target);
        Reflect.defineMetadata(METADATA.OBJECT.TYPES, typeList, target);
    };
}
