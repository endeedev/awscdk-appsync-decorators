import { DIRECTIVE_ID, METADATA } from '@/constants';
import { Cognito, Custom } from '@/decorators';

import { getName, getNames } from '../../helpers';

describe('Decorators: Cognito', () => {
    describe('@Cognito(group, groups)', () => {
        const GROUP = getName();
        const GROUPS = getNames();
        const GROUP_NAMES = [GROUP, ...GROUPS].join(', ');

        @Cognito(GROUP, ...GROUPS)
        @Custom('')
        class TestType {
            @Cognito(GROUP, ...GROUPS)
            @Custom('')
            prop = 0;
        }

        test(`should set '${METADATA.DIRECTIVE.IDS}' to [${DIRECTIVE_ID.COGNITO}, ${DIRECTIVE_ID.CUSTOM}] for type`, () => {
            const ids = Reflect.getMetadata(METADATA.DIRECTIVE.IDS, TestType);

            expect(ids).toHaveLength(2);
            expect(ids).toContain(DIRECTIVE_ID.COGNITO);
            expect(ids).toContain(DIRECTIVE_ID.CUSTOM);
        });

        test(`should set '${METADATA.DIRECTIVE.IDS}' to [${DIRECTIVE_ID.COGNITO}, ${DIRECTIVE_ID.CUSTOM}] for property`, () => {
            const ids = Reflect.getMetadata(METADATA.DIRECTIVE.IDS, TestType.prototype, 'prop');

            expect(ids).toHaveLength(2);
            expect(ids).toContain(DIRECTIVE_ID.COGNITO);
            expect(ids).toContain(DIRECTIVE_ID.CUSTOM);
        });

        test(`should set '${METADATA.DIRECTIVE.COGNITO_GROUPS}' to [${GROUP_NAMES}] for type`, () => {
            const groups = Reflect.getMetadata(METADATA.DIRECTIVE.COGNITO_GROUPS, TestType);
            expect(groups).toEqual([GROUP, ...GROUPS]);
        });

        test(`should set '${METADATA.DIRECTIVE.COGNITO_GROUPS}' to [${GROUP_NAMES}] for property`, () => {
            const groups = Reflect.getMetadata(METADATA.DIRECTIVE.COGNITO_GROUPS, TestType.prototype, 'prop');
            expect(groups).toEqual([GROUP, ...GROUPS]);
        });
    });
});
