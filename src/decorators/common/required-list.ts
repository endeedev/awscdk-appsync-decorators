import { METADATA } from '@/constants';

export function RequiredList(): PropertyDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata(METADATA.COMMON.REQUIRED_LIST, true, target, propertyKey);
    };
}
