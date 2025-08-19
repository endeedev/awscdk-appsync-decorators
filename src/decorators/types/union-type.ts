import { Type } from '@/common';
import { METADATA, TYPE_ID } from '@/constants';

import { getTypeContext } from '../helpers';

export function UnionType(): ClassDecorator;
export function UnionType(...types: Type<object>[]): ClassDecorator;
export function UnionType(name: string, ...types: Type<object>[]): ClassDecorator;
export function UnionType(...args: unknown[]): ClassDecorator {
    return (target) => {
        const { name, types } = getTypeContext(target, ...args);

        Reflect.defineMetadata(METADATA.TYPE.ID, TYPE_ID.UNION, target);
        Reflect.defineMetadata(METADATA.TYPE.NAME, name, target);
        Reflect.defineMetadata(METADATA.UNION.TYPES, types, target);
    };
}
