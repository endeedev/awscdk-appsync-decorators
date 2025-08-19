import { Type } from '@/common';
import { METADATA } from '@/constants';
import { ResolverBase } from '@/resolvers';

export function Resolver(type: Type<ResolverBase>, ...functions: string[]): PropertyDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata(METADATA.COMMON.RESOLVER_TYPE, type, target, propertyKey);
        Reflect.defineMetadata(METADATA.COMMON.RESOLVER_FUNCTIONS, functions, target, propertyKey);
    };
}
