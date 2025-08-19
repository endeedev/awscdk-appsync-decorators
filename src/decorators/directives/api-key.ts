import { DIRECTIVE_ID } from '@/constants';

import { defineDirectiveMetadata } from '../helpers';

export function ApiKey(): ClassDecorator & PropertyDecorator {
    return (...args: unknown[]) => defineDirectiveMetadata(DIRECTIVE_ID.API_KEY, args);
}
