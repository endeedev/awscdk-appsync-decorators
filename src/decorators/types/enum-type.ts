import { METADATA, TYPE_ID } from '@/constants';

export function EnumType(name?: string): ClassDecorator {
    return (target) => {
        const typeName: string = name ?? target.name;

        Reflect.defineMetadata(METADATA.TYPE.ID, TYPE_ID.ENUM, target);
        Reflect.defineMetadata(METADATA.TYPE.NAME, typeName, target);
    };
}
