import { METADATA, TYPE_ID } from '@/constants';

export function InterfaceType(name?: string): ClassDecorator {
    return (target) => {
        const typeName: string = name ?? target.name;

        Reflect.defineMetadata(METADATA.TYPE.ID, TYPE_ID.INTERFACE, target);
        Reflect.defineMetadata(METADATA.TYPE.NAME, typeName, target);
    };
}
