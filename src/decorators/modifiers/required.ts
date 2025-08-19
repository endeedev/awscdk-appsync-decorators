import { METADATA } from '@/constants';

export function Required(): PropertyDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata(METADATA.MODIFIER.REQUIRED, true, target, propertyKey);
    };
}
