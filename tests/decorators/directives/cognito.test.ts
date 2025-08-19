import { DIRECTIVE_ID, METADATA } from '@/constants';
import { Cognito } from '@/decorators';

import { getNames } from '../../helpers';

describe('Decorator: Cognito', () => {
    describe('@Cognito()', () => {
        @Cognito()
        class TestType {
            @Cognito()
            prop = 0;
        }

        test(`should set '${METADATA.DIRECTIVE.ID}' to '${DIRECTIVE_ID.COGNITO}' for class`, () => {
            const id = Reflect.getMetadata(METADATA.DIRECTIVE.ID, TestType);
            expect(id).toBe(DIRECTIVE_ID.COGNITO);
        });

        test(`should set '${METADATA.DIRECTIVE.ID}' to '${DIRECTIVE_ID.COGNITO}' for property`, () => {
            const id = Reflect.getMetadata(METADATA.DIRECTIVE.ID, TestType.prototype, 'prop');
            expect(id).toBe(DIRECTIVE_ID.COGNITO);
        });
    });

    describe('@Cognito(groups)', () => {
        const GROUPS = getNames();
        const GROUP_NAMES = GROUPS.join(', ');

        @Cognito(...GROUPS)
        class TestType {
            @Cognito(...GROUPS)
            prop = 0;
        }

        test(`should set '${METADATA.DIRECTIVE.ID}' to '${DIRECTIVE_ID.COGNITO}' for class`, () => {
            const id = Reflect.getMetadata(METADATA.DIRECTIVE.ID, TestType);
            expect(id).toBe(DIRECTIVE_ID.COGNITO);
        });

        test(`should set '${METADATA.DIRECTIVE.ID}' to '${DIRECTIVE_ID.COGNITO}' for property`, () => {
            const id = Reflect.getMetadata(METADATA.DIRECTIVE.ID, TestType.prototype, 'prop');
            expect(id).toBe(DIRECTIVE_ID.COGNITO);
        });

        test(`should set '${METADATA.COGNITO.GROUPS}' to '${GROUP_NAMES}' for class`, () => {
            const groups = Reflect.getMetadata(METADATA.COGNITO.GROUPS, TestType);
            expect(groups).toEqual(GROUPS);
        });

        test(`should set '${METADATA.COGNITO.GROUPS}' to '${GROUP_NAMES}' for class`, () => {
            const groups = Reflect.getMetadata(METADATA.COGNITO.GROUPS, TestType);
            expect(groups).toEqual(GROUPS);
        });
    });
});
