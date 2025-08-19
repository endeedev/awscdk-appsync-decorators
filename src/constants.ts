import 'reflect-metadata';

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
    APIKEY: 'directive:id:apikey',
    COGNITO: 'directive:id:cognito',
    IAM: 'directive:id:iam',
    LAMBDA: 'directive:id:lambda',
    OIDC: 'directive:id:oidc',
};

export const METADATA = {
    // TYPES
    TYPE: {
        ID: 'metadata:type:id',
        NAME: 'metadata:type:name',
    },
    COMMON: {
        ARGS: 'metadata:args',
        LIST: 'metadata:list',
        REQUIRED: 'metadata:required',
        REQUIRED_LIST: 'metadata:required:list',
    },
    OBJECT: {
        TYPES: 'metadata:object:types',
    },
    UNION: {
        TYPES: 'metadata:union:types',
    },
    // DIRECTIVES
    DIRECTIVE: {
        ID: 'metadata:directive:id',
    },
    COGNITO: {
        GROUPS: 'metadata:cognito:groups',
    },
    // RESOLVERS
};
