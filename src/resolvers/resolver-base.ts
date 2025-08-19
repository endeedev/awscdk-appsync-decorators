export abstract class ResolverBase {
    abstract readonly dataSource: string;

    readonly maxBatchSize?: number;

    constructor(public readonly runtime: string) {}
}
