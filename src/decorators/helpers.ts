/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Type } from '@/common';
import { METADATA } from '@/constants';

export const getTypeContext = (target: Function, ...args: unknown[]) => {
    let name = target.name;

    let types: Type<object>[] = [];

    // Parse the args to extract the name and types list (if defined)
    if (args.length > 0) {
        const [first, ...others] = args;

        if (typeof first === 'string') {
            name = first as string;
            types = others as Type<object>[];
        } else {
            types = args as Type<object>[];
        }
    }

    return {
        name,
        types,
    };
};

export const defineDirectiveMetadata = (
    directiveId: string,
    args: unknown[],
    callback?: (target: Function, propertyKey?: string | symbol) => void,
) => {
    const [target, propertyKey] = args;

    // Define the directive id metadata - can be class or property
    if (propertyKey) {
        Reflect.defineMetadata(METADATA.DIRECTIVE.ID, directiveId, target as Function, propertyKey as string | symbol);
    } else {
        Reflect.defineMetadata(METADATA.DIRECTIVE.ID, directiveId, target as Function);
    }

    // If callback exists, then call it for any extra metadata needed
    if (callback) {
        callback(target as Function, propertyKey as string | symbol);
    }
};
