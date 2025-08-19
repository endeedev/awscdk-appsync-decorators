import { METADATA } from '@/constants';

export function Required(): PropertyDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata(METADATA.COMMON.REQUIRED, true, target, propertyKey);
    };
}
