import { Type } from '@/common';
import { METADATA } from '@/constants';
import { OperationBase } from '@/resolvers';

export function Resolver(operation: Type<OperationBase>, ...functions: string[]): PropertyDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata(METADATA.COMMON.RESOLVER_OPERATION, operation, target, propertyKey);
        Reflect.defineMetadata(METADATA.COMMON.RESOLVER_FUNCTIONS, functions, target, propertyKey);
    };
}
