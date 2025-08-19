import { METADATA, TYPE_ID } from '@/constants';
import { SchemaType } from '@/types';

export function UnionType(): ClassDecorator;
export function UnionType(...types: SchemaType<object>[]): ClassDecorator;
export function UnionType(name: string, ...types: SchemaType<object>[]): ClassDecorator;
export function UnionType(...args: unknown[]): ClassDecorator {
    return (target) => {
        let typeName: string = target.name;
        let typeList: SchemaType<object>[] = [];

        // Parse the args to extract the name and types list (if defined)
        if (args.length > 0) {
            const [first, ...others] = args;

            if (typeof first === 'string') {
                typeName = first as string;
                typeList = others as SchemaType<object>[];
            } else {
                typeList = args as SchemaType<object>[];
            }
        }

        Reflect.defineMetadata(METADATA.TYPE.ID, TYPE_ID.UNION, target);
        Reflect.defineMetadata(METADATA.TYPE.NAME, typeName, target);
        Reflect.defineMetadata(METADATA.UNION.TYPES, typeList, target);
    };
}
