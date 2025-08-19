export interface DirectiveInfo {
    readonly directiveId: string;
    readonly context?: Readonly<Record<string, unknown>>;
}
