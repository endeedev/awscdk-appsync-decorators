import { METADATA, TYPE_ID } from '@/constants';
import { SchemaType } from '@/types';

export function ObjectType(): ClassDecorator;
export function ObjectType(...types: SchemaType<object>[]): ClassDecorator;
export function ObjectType(name: string, ...types: SchemaType<object>[]): ClassDecorator;
export function ObjectType(...args: unknown[]): ClassDecorator {
    return (target) => {
        let typeName: string = target.name;
        let objectTypes: SchemaType<object>[] = [];

        // Parse the args to extract the name and types array (if defined)
        if (args.length > 0) {
            const [first, ...others] = args;

            if (typeof first === 'string') {
                typeName = first as string;
                objectTypes = others as SchemaType<object>[];
            } else {
                objectTypes = args as SchemaType<object>[];
            }
        }

        Reflect.defineMetadata(METADATA.TYPE.ID, TYPE_ID.OBJECT, target);
        Reflect.defineMetadata(METADATA.TYPE.NAME, typeName, target);
        Reflect.defineMetadata(METADATA.OBJECT.TYPES, objectTypes, target);
    };
}
