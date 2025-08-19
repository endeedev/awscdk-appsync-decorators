import { METADATA } from '@/constants';

export function List(): PropertyDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata(METADATA.COMMON.LIST, true, target, propertyKey);
    };
}
