import { DIRECTIVE_ID, METADATA } from '@/constants';
import { Custom } from '@/decorators';

import { getName } from '../../helpers';

describe('Decorator: Custom', () => {
    describe('@Custom(statement)', () => {
        const STATEMENT = getName();

        @Custom(STATEMENT)
        class TestType {
            @Custom(STATEMENT)
            prop = 0;
        }

        test(`should set '${METADATA.DIRECTIVE.IDS}' to [${DIRECTIVE_ID.CUSTOM}] for type`, () => {
            const ids = Reflect.getMetadata(METADATA.DIRECTIVE.IDS, TestType);

            expect(ids).toHaveLength(1);
            expect(ids).toContain(DIRECTIVE_ID.CUSTOM);
        });

        test(`should set '${METADATA.DIRECTIVE.IDS}' to [${DIRECTIVE_ID.CUSTOM}] for property`, () => {
            const ids = Reflect.getMetadata(METADATA.DIRECTIVE.IDS, TestType.prototype, 'prop');

            expect(ids).toHaveLength(1);
            expect(ids).toContain(DIRECTIVE_ID.CUSTOM);
        });

        test(`should set '${METADATA.DIRECTIVE.CUSTOM_STATEMENT}' to '${STATEMENT}' for type`, () => {
            const statement = Reflect.getMetadata(METADATA.DIRECTIVE.CUSTOM_STATEMENT, TestType);
            expect(statement).toBe(STATEMENT);
        });

        test(`should set '${METADATA.DIRECTIVE.CUSTOM_STATEMENT}' to '${STATEMENT}' for property`, () => {
            const statement = Reflect.getMetadata(METADATA.DIRECTIVE.CUSTOM_STATEMENT, TestType.prototype, 'prop');
            expect(statement).toBe(STATEMENT);
        });
    });
});
