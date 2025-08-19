import { DIRECTIVE_ID, METADATA } from '@/constants';

import { defineDirectiveMetadata } from '../helpers';

export function Cognito(group: string, ...groups: string[]): ClassDecorator & PropertyDecorator {
    return (...args: unknown[]) =>
        defineDirectiveMetadata(DIRECTIVE_ID.COGNITO, args, (target, propertyKey) =>
            propertyKey
                ? Reflect.defineMetadata(METADATA.DIRECTIVE.COGNITO_GROUPS, [group, ...groups], target, propertyKey)
                : Reflect.defineMetadata(METADATA.DIRECTIVE.COGNITO_GROUPS, [group, ...groups], target),
        );
}
