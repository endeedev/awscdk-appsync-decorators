export abstract class OperationBase {
    abstract readonly dataSourceName: string;

    constructor(public readonly runtime: string) {}
}
