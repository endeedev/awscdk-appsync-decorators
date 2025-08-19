import { DIRECTIVE_ID, METADATA } from '@/constants';

import { defineDirectiveMetadata } from '../helpers';

export function Subscribe(mutation: string, ...mutations: string[]): PropertyDecorator {
    return (...args: unknown[]) =>
        defineDirectiveMetadata(DIRECTIVE_ID.SUBSCRIBE, args, (target, propertyKey) =>
            Reflect.defineMetadata(
                METADATA.DIRECTIVE.SUBSCRIBE_MUTATIONS,
                [mutation, ...mutations],
                target,
                propertyKey!,
            ),
        );
}
