import { Code, MappingTemplate } from 'aws-cdk-lib/aws-appsync';

import { METADATA } from '@/constants';
import { Resolver } from '@/decorators';
import { JsResolver, VtlResolver } from '@/resolvers';

import { getName, getNumber } from '../../helpers';

describe('Decorators: Resolver', () => {
    const DATA_SOURCE = getName();
    const MAX_BATCH_SIZE = getNumber();

    describe('@Resolver(type)', () => {
        class TestResolver extends JsResolver {
            dataSource = DATA_SOURCE;
            maxBatchSize = MAX_BATCH_SIZE;
            code = Code.fromInline('// CODE');
        }

        class TestType {
            @Resolver(TestResolver)
            prop = 0;
        }

        test(`should set '${METADATA.COMMON.RESOLVER_TYPE}' to [${TestResolver.name}]`, () => {
            const type = Reflect.getMetadata(METADATA.COMMON.RESOLVER_TYPE, TestType.prototype, 'prop');
            expect(type).toEqual(TestResolver);
        });

        test(`should set '${METADATA.COMMON.RESOLVER_FUNCTIONS}' to []`, () => {
            const functions = Reflect.getMetadata(METADATA.COMMON.RESOLVER_FUNCTIONS, TestType.prototype, 'prop');
            expect(functions).toEqual([]);
        });
    });

    describe('@Resolver(type, functions)', () => {
        const FUNCTION1 = getName();
        const FUNCTION2 = getName();
        const FUNCTIONS = [FUNCTION1, FUNCTION2].join(', ');

        class TestResolver extends VtlResolver {
            dataSource = DATA_SOURCE;
            maxBatchSize = MAX_BATCH_SIZE;
            requestMappingTemplate = MappingTemplate.fromString('# REQUEST');
            responseMappingTemplate = MappingTemplate.fromString('# RESPONSE');
        }

        class TestType {
            @Resolver(TestResolver, FUNCTION1, FUNCTION2)
            prop = 0;
        }

        test(`should set '${METADATA.COMMON.RESOLVER_TYPE}' to [${TestResolver.name}]`, () => {
            const type = Reflect.getMetadata(METADATA.COMMON.RESOLVER_TYPE, TestType.prototype, 'prop');
            expect(type).toEqual(TestResolver);
        });

        test(`should set '${METADATA.COMMON.RESOLVER_FUNCTIONS}' to [${FUNCTIONS}]`, () => {
            const functions = Reflect.getMetadata(METADATA.COMMON.RESOLVER_FUNCTIONS, TestType.prototype, 'prop');
            expect(functions).toEqual([FUNCTION1, FUNCTION2]);
        });
    });
});
