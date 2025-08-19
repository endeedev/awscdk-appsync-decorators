export interface SchemaType<TType> {
    new (): TType;
    readonly name: string;
    readonly prototype: TType;
}
