import { DIRECTIVE_ID, METADATA } from '@/constants';
import { Custom, Subscribe } from '@/decorators';

import { getName, getNames } from '../../helpers';

describe('Decorators: Subscribe', () => {
    describe('@Subscribe(mutation, mutations)', () => {
        const MUTATION = getName();
        const MUTATIONS = getNames();
        const MUTATION_NAMES = [MUTATION, ...MUTATIONS].join(', ');

        class TestType {
            @Subscribe(MUTATION, ...MUTATIONS)
            @Custom('')
            prop = 0;
        }

        test(`should set '${METADATA.DIRECTIVE.IDS}' to [${DIRECTIVE_ID.SUBSCRIBE}, ${DIRECTIVE_ID.CUSTOM}]`, () => {
            const ids = Reflect.getMetadata(METADATA.DIRECTIVE.IDS, TestType.prototype, 'prop');

            expect(ids).toHaveLength(2);
            expect(ids).toContain(DIRECTIVE_ID.SUBSCRIBE);
            expect(ids).toContain(DIRECTIVE_ID.CUSTOM);
        });

        test(`should set '${METADATA.DIRECTIVE.SUBSCRIBE_MUTATIONS}' to [${MUTATION_NAMES}]`, () => {
            const groups = Reflect.getMetadata(METADATA.DIRECTIVE.SUBSCRIBE_MUTATIONS, TestType.prototype, 'prop');
            expect(groups).toEqual([MUTATION, ...MUTATIONS]);
        });
    });
});
