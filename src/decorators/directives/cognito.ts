import { DIRECTIVE_ID, METADATA } from '@/constants';

import { defineDirectiveMetadata } from '../helpers';

export function Cognito(...groups: string[]): ClassDecorator & PropertyDecorator {
    return (...args: unknown[]) =>
        defineDirectiveMetadata(DIRECTIVE_ID.COGNITO, args, (target, propertyKey) =>
            propertyKey
                ? Reflect.defineMetadata(METADATA.COGNITO.GROUPS, groups, target, propertyKey)
                : Reflect.defineMetadata(METADATA.COGNITO.GROUPS, groups, target),
        );
}
