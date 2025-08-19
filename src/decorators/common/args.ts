import { Type } from '@/common';
import { METADATA } from '@/constants';

export function Args(type: Type<object>): PropertyDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata(METADATA.COMMON.ARGS, type, target, propertyKey);
    };
}
