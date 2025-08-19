import { Type } from '@/common';
import { METADATA } from '@/constants';
import { OperationBase } from '@/resolvers';

export function Resolver(operation: Type<OperationBase>, ...operations: Type<OperationBase>[]): PropertyDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata(METADATA.COMMON.RESOLVER_OPERATIONS, [operation, ...operations], target, propertyKey);
    };
}
