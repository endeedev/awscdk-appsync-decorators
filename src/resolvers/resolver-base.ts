export abstract class ResolverBase {
    abstract readonly dataSource: string;

    constructor(public readonly runtime: string) {}
}
