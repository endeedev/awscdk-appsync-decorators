// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export interface Type<TType> extends Function {
    new (): TType;
    readonly name: string;
    readonly prototype: TType;
}
