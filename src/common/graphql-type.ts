import { GraphqlType as GraphqlTypeBase, GraphqlTypeOptions, Type } from 'awscdk-appsync-utils';

// GraphqlType has a protected constructor
// So create a proxy class to dynamically create the types
export class GraphqlType extends GraphqlTypeBase {
    constructor(type: Type, options?: GraphqlTypeOptions) {
        super(type, options);
    }
}
