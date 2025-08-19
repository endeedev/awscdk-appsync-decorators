export class TypeStore<TType> {
    private _items: Record<string, TType> = {};

    getType(name: string): TType | undefined {
        return this._items[name];
    }

    registerType(name: string, type: TType): void {
        this._items[name] = type;
    }
}
