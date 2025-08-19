import { DIRECTIVE_ID, METADATA } from '@/constants';

import { defineDirectiveMetadata } from '../helpers';

export function Custom(statement: string): ClassDecorator & PropertyDecorator {
    return (...args: unknown[]) =>
        defineDirectiveMetadata(DIRECTIVE_ID.CUSTOM, args, (target, propertyKey) =>
            propertyKey
                ? Reflect.defineMetadata(METADATA.DIRECTIVE.CUSTOM_STATEMENT, statement, target, propertyKey)
                : Reflect.defineMetadata(METADATA.DIRECTIVE.CUSTOM_STATEMENT, statement, target),
        );
}
