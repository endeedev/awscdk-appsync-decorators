import { ISchema } from 'aws-cdk-lib/aws-appsync';
import { CodeFirstSchema } from 'awscdk-appsync-utils';

import { Type } from '@/common';
import { TYPE_ID } from '@/constants';

import { TypeFactory } from './type-factory';

interface SchemaDefinition<TQuery, TMutation> {
    query: Type<TQuery>;
    mutation?: Type<TMutation>;
}

export class SchemaBuilder<TQuery, TMutation> {
    private _query?: SchemaDefinition<TQuery, TMutation>['query'];
    private _mutation?: SchemaDefinition<TQuery, TMutation>['mutation'];

    constructor(private readonly factory: TypeFactory) {}

    static buildSchema<TQuery, TMutation = undefined>(definition: SchemaDefinition<TQuery, TMutation>): ISchema {
        const { query, mutation } = definition;

        // Build the schema based on the provided definition
        const factory = new TypeFactory();
        const builder = new SchemaBuilder<TQuery, TMutation>(factory);

        builder.addQuery(query);

        if (mutation) {
            builder.addMutation(mutation);
        }

        return builder.buildSchema();
    }

    addQuery(query: SchemaDefinition<TQuery, TMutation>['query']): void {
        this._query = query;
    }

    addMutation(mutation: SchemaDefinition<TQuery, TMutation>['mutation']): void {
        this._mutation = mutation;
    }

    buildSchema(): ISchema {
        const schema = new CodeFirstSchema();

        // Add the query type
        if (this._query) {
            const { fields } = this.factory.createRootType(TYPE_ID.QUERY, this._query as Type<object>, schema);

            for (const [name, field] of Object.entries(fields)) {
                schema.addQuery(name, field);
            }
        }

        // Add the mutation type
        if (this._mutation) {
            const { fields } = this.factory.createRootType(TYPE_ID.MUTATION, this._mutation as Type<object>, schema);

            for (const [name, field] of Object.entries(fields)) {
                schema.addMutation(name, field);
            }
        }

        return schema;
    }
}
