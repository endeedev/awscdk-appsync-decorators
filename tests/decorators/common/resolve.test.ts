import { Code, FunctionRuntime, MappingTemplate } from 'aws-cdk-lib/aws-appsync';

import { METADATA } from '@/constants';
import { Resolve } from '@/decorators';
import { JsFunction, VtlFunction } from '@/functions';

import { getName, getTypeNames } from '../../helpers';

describe('Decorator: Resolve', () => {
    describe('@Resolve(functions)', () => {
        const DATA_SOURCE = getName();

        class TestJsFunction extends JsFunction {
            dataSourceName = DATA_SOURCE;
            runtime = FunctionRuntime.JS_1_0_0;
            code = Code.fromInline(`console.log('CODE');`);
        }

        class TestVtlFunction extends VtlFunction {
            dataSourceName = DATA_SOURCE;
            requestMappingTemplate = MappingTemplate.fromString('# REQUEST');
            responseMappingTemplate = MappingTemplate.fromString('# RESPONSE');
        }

        class TestType {
            @Resolve(TestJsFunction, TestVtlFunction)
            prop = 0;
        }

        const TYPE_NAMES = getTypeNames(TestJsFunction, TestVtlFunction);

        test(`should set '${METADATA.COMMON.RESOLVER_FUNCTIONS}' to [${TYPE_NAMES}]`, () => {
            const functions = Reflect.getMetadata(METADATA.COMMON.RESOLVER_FUNCTIONS, TestType.prototype, 'prop');
            expect(functions).toEqual([TestJsFunction, TestVtlFunction]);
        });
    });
});
