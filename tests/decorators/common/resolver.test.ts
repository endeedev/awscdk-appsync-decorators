import { Code, MappingTemplate } from 'aws-cdk-lib/aws-appsync';

import { METADATA } from '@/constants';
import { Resolver } from '@/decorators';
import { JsOperation, VtlOperation } from '@/resolvers';

import { getName, getTypeNames } from '../../helpers';

describe('Decorators: Resolver', () => {
    describe('@Resolver(operation, operations)', () => {
        const DATA_SOURCE = getName();

        class TestJsOperation extends JsOperation {
            dataSourceName = DATA_SOURCE;
            code = Code.fromInline('// CODE');
        }

        class TestVtlOperation extends VtlOperation {
            dataSourceName = DATA_SOURCE;
            requestMappingTemplate = MappingTemplate.fromString('# REQUEST');
            responseMappingTemplate = MappingTemplate.fromString('# RESPONSE');
        }

        class TestType {
            @Resolver(TestJsOperation, TestVtlOperation)
            prop = 0;
        }

        const TYPE_NAMES = getTypeNames(TestJsOperation, TestVtlOperation);

        test(`should set '${METADATA.COMMON.RESOLVER_OPERATIONS}' to [${TYPE_NAMES}]`, () => {
            const operations = Reflect.getMetadata(METADATA.COMMON.RESOLVER_OPERATIONS, TestType.prototype, 'prop');
            expect(operations).toEqual([TestJsOperation, TestVtlOperation]);
        });
    });
});
