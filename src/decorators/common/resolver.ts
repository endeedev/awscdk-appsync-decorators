import { Type } from '@/common';
import { METADATA } from '@/constants';
import { FunctionBase } from '@/resolvers';

export function Resolver(func: Type<FunctionBase>, ...funcs: Type<FunctionBase>[]): PropertyDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata(METADATA.COMMON.RESOLVER_FUNCTIONS, [func, ...funcs], target, propertyKey);
    };
}
