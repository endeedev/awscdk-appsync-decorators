import { Type } from "@/common";
import { METADATA } from "@/constants";
import { FunctionBase } from "@/functions";

export function Resolve(...functions: Type<FunctionBase>[]): PropertyDecorator {
    return (target, propertyKey) => {        
        Reflect.defineMetadata(METADATA.COMMON.RESOLVER_FUNCTIONS, functions, target, propertyKey);
    };
}
