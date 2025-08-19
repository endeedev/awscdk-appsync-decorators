import { Code, MappingTemplate } from 'aws-cdk-lib/aws-appsync';

import { METADATA } from '@/constants';
import { Resolver } from '@/decorators';
import { JsOperation, VtlOperation } from '@/resolvers';

import { getName } from '../../helpers';

describe('Decorators: Resolver', () => {
    describe('@Resolver(operation)', () => {
        const DATA_SOURCE = getName();

        class TestOperation extends JsOperation {
            dataSourceName = DATA_SOURCE;
            code = Code.fromInline('// CODE');
        }

        class TestType {
            @Resolver(TestOperation)
            prop = 0;
        }

        test(`should set '${METADATA.COMMON.RESOLVER_OPERATION}' to [${TestOperation.name}]`, () => {
            const operation = Reflect.getMetadata(METADATA.COMMON.RESOLVER_OPERATION, TestType.prototype, 'prop');
            expect(operation).toEqual(TestOperation);
        });

        test(`should set '${METADATA.COMMON.RESOLVER_FUNCTIONS}' to []`, () => {
            const functions = Reflect.getMetadata(METADATA.COMMON.RESOLVER_FUNCTIONS, TestType.prototype, 'prop');
            expect(functions).toEqual([]);
        });
    });

    describe('@Resolver(operation, functions)', () => {
        const DATA_SOURCE = getName();
        const FUNCTION1 = getName();
        const FUNCTION2 = getName();
        const FUNCTIONS = [FUNCTION1, FUNCTION2].join(', ');

        class TestOperation extends VtlOperation {
            dataSourceName = DATA_SOURCE;
            requestMappingTemplate = MappingTemplate.fromString('# REQUEST');
            responseMappingTemplate = MappingTemplate.fromString('# RESPONSE');
        }

        class TestType {
            @Resolver(TestOperation, FUNCTION1, FUNCTION2)
            prop = 0;
        }

        test(`should set '${METADATA.COMMON.RESOLVER_OPERATION}' to [${TestOperation.name}]`, () => {
            const operation = Reflect.getMetadata(METADATA.COMMON.RESOLVER_OPERATION, TestType.prototype, 'prop');
            expect(operation).toEqual(TestOperation);
        });

        test(`should set '${METADATA.COMMON.RESOLVER_FUNCTIONS}' to [${FUNCTIONS}]`, () => {
            const functions = Reflect.getMetadata(METADATA.COMMON.RESOLVER_FUNCTIONS, TestType.prototype, 'prop');
            expect(functions).toEqual([FUNCTION1, FUNCTION2]);
        });
    });
});
