import { GraphqlType } from '@/common';
import { SchemaBuilder } from '@/core';

describe('Core: Schema Builder', () => {
    class TestQuery {
        id = GraphqlType.id();
    }

    class TestMutation {
        id = GraphqlType.id();
    }

    test('should build schema', () => {
        SchemaBuilder.buildSchema({
            query: TestQuery,
            mutation: TestMutation,
        });
    });
});
