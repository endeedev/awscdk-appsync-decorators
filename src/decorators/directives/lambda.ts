import { DIRECTIVE_ID } from '@/constants';

import { defineDirectiveMetadata } from '../helpers';

export function Lambda(): ClassDecorator & PropertyDecorator {
    return (...args: unknown[]) => defineDirectiveMetadata(DIRECTIVE_ID.LAMBDA, args);
}
