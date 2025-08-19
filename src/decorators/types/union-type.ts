import { Type } from '@/common';
import { METADATA, TYPE_ID } from '@/constants';

import { getTypeContext } from '../helpers';

export function UnionType(type: Type<object>, ...types: Type<object>[]): ClassDecorator;
export function UnionType(name: string, type: Type<object>, ...types: Type<object>[]): ClassDecorator;
export function UnionType(...args: unknown[]): ClassDecorator {
    return (target) => {
        const { name, types } = getTypeContext(target, ...args);

        Reflect.defineMetadata(METADATA.TYPE.ID, TYPE_ID.UNION, target);
        Reflect.defineMetadata(METADATA.TYPE.NAME, name, target);
        Reflect.defineMetadata(METADATA.TYPE.UNION_TYPES, types, target);
    };
}
