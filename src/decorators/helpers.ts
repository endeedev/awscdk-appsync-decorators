/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Type } from '@/common';
import { METADATA } from '@/constants';

const mergeTypeDirectives = (directiveId: string, target: Function) => {
    const directiveIds = Reflect.hasMetadata(METADATA.DIRECTIVE.IDS, target)
        ? Reflect.getMetadata(METADATA.DIRECTIVE.IDS, target)
        : [];

    return [...directiveIds, directiveId];
};

const mergePropertyDirectives = (directiveId: string, target: Function, propertyKey: string | symbol) => {
    const directiveIds = Reflect.hasMetadata(METADATA.DIRECTIVE.IDS, target, propertyKey)
        ? Reflect.getMetadata(METADATA.DIRECTIVE.IDS, target, propertyKey)
        : [];

    return [...directiveIds, directiveId];
};

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

    // Define the directive id metadata - can be type or property
    if (propertyKey) {
        const directiveIds = mergePropertyDirectives(directiveId, target as Function, propertyKey as string | symbol);
        Reflect.defineMetadata(
            METADATA.DIRECTIVE.IDS,
            directiveIds,
            target as Function,
            propertyKey as string | symbol,
        );
    } else {
        const directiveIds = mergeTypeDirectives(directiveId, target as Function);
        Reflect.defineMetadata(METADATA.DIRECTIVE.IDS, directiveIds, target as Function);
    }

    // If a callback exists, then call it for any extra metadata needed
    if (callback) {
        callback(target as Function, propertyKey as string | symbol);
    }
};
