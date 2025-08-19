import { METADATA } from '@/constants';

export function List(): PropertyDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata(METADATA.MODIFIER.LIST, true, target, propertyKey);
    };
}
