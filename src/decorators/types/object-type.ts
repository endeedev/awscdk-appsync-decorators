import { Type } from '@/common';
import { METADATA, TYPE_ID } from '@/constants';

import { getTypeContext } from '../helpers';

export function ObjectType(): ClassDecorator;
export function ObjectType(...types: Type<object>[]): ClassDecorator;
export function ObjectType(name: string, ...types: Type<object>[]): ClassDecorator;
export function ObjectType(...args: unknown[]): ClassDecorator {
    return (target) => {
        const { name, types } = getTypeContext(target, ...args);

        Reflect.defineMetadata(METADATA.TYPE.ID, TYPE_ID.OBJECT, target);
        Reflect.defineMetadata(METADATA.TYPE.NAME, name, target);
        Reflect.defineMetadata(METADATA.TYPE.OBJECT_TYPES, types, target);
    };
}
