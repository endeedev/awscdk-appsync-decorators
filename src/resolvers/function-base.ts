export abstract class FunctionBase {
    abstract readonly dataSourceName: string;

    constructor(public readonly type: string) {}
}
