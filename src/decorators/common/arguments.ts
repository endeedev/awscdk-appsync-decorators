import { Type } from '@/common';
import { METADATA } from '@/constants';

export function Arguments(type: Type<object>): PropertyDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata(METADATA.COMMON.ARGUMENTS, type, target, propertyKey);
    };
}
