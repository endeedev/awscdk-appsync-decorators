import { DIRECTIVE_ID } from '@/constants';

import { defineDirectiveMetadata } from '../helpers';

export function Iam(): ClassDecorator & PropertyDecorator {
    return (...args: unknown[]) => defineDirectiveMetadata(DIRECTIVE_ID.IAM, args);
}
