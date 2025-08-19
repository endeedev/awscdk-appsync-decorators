import { METADATA, TYPE_ID } from '@/constants';

import { getTypeContext } from '../helpers';

export function EnumType(name?: string): ClassDecorator {
    return (target) => {
        const { name: typeName } = getTypeContext(target, name);

        Reflect.defineMetadata(METADATA.TYPE.ID, TYPE_ID.ENUM, target);
        Reflect.defineMetadata(METADATA.TYPE.NAME, typeName, target);
    };
}
