import { METADATA, TYPE_ID } from '@/constants';

export function InputType(name?: string): ClassDecorator {
    return (target) => {
        const typeName: string = name ?? target.name;

        Reflect.defineMetadata(METADATA.TYPE.ID, TYPE_ID.INPUT, target);
        Reflect.defineMetadata(METADATA.TYPE.NAME, typeName, target);
    };
}
