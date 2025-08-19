import { ResolverBase } from '@/resolvers';

import { Type } from './type';

export interface ResolverInfo {
    readonly resolverType: Type<ResolverBase>;
    readonly functions: string[];
}
