import { ResolverBase } from '@/resolvers';

import { Type } from './type';

export interface ResolverInfo {
    readonly resolver: Type<ResolverBase>;
    readonly functions: string[];
}
