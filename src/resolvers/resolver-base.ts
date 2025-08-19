export abstract class ResolverBase {
    readonly dataSource?: string;
    readonly maxBatchSize?: number;

    constructor(public readonly runtime: string) {}
}
