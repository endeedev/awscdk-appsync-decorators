import { Type } from '@/common';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
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
