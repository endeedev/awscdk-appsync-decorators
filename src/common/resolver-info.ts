import { OperationBase } from '@/resolvers';

export interface ResolverInfo {
    readonly operation: OperationBase;
    readonly functions?: string[];
}
