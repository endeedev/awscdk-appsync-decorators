import { METADATA } from '@/constants';

export function Cache(ttl: number, ...keys: string[]): PropertyDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata(METADATA.COMMON.CACHE_TTL, ttl, target, propertyKey);
        Reflect.defineMetadata(METADATA.COMMON.CACHE_KEYS, keys, target, propertyKey);
    };
}
