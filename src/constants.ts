import 'reflect-metadata';

export const LAMBDA_DIRECTIVE_STATEMENT = '@aws_lambda';

export const TYPE_ID = {
    QUERY: 'type:id:query',
    MUTATION: 'type:id:mutation',
    SUBSCRIPTION: 'type:id:subscription',
    SCALAR: 'type:id:scalar',
    ENUM: 'type:id:enum',
    INPUT: 'type:id:input',
    INTERFACE: 'type:id:interface',
    OBJECT: 'type:id:object',
    UNION: 'type:id:union',
};

export const DIRECTIVE_ID = {
    API_KEY: 'directive:id:apikey',
    COGNITO: 'directive:id:cognito',
    IAM: 'directive:id:iam',
    LAMBDA: 'directive:id:lambda',
    OIDC: 'directive:id:oidc',
    CUSTOM: 'directive:id:custom',
};

export const RESOLVER_RUNTIME = {
    JS: 'resolver:runtime:js',
    VTL: 'resolver:runtime:vtl',
};

export const METADATA = {
    COMMON: {
        ARGS: 'metadata:args',
        LIST: 'metadata:list',
        REQUIRED: 'metadata:required',
        REQUIRED_LIST: 'metadata:required:list',
        RESOLVER_TYPE: 'metadata:resolver:type',
        RESOLVER_FUNCTIONS: 'metadata:resolver:functions',
    },
    TYPE: {
        ID: 'metadata:type:id',
        NAME: 'metadata:type:name',
        OBJECT_TYPES: 'metadata:type:object:types',
        UNION_TYPES: 'metadata:type:union:types',
    },
    DIRECTIVE: {
        IDS: 'metadata:directive:ids',
        COGNITO_GROUPS: 'metadata:directive:cognito:groups',
        CUSTOM_STATEMENT: 'metadata:directive:custom:statement',
    },
};
