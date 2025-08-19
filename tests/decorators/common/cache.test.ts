import { METADATA } from '@/constants';
import { Cache } from '@/decorators';

import { getNames, getNumber } from '../../helpers';

describe('Decorators: Cache', () => {
    describe('@Cache(ttl, keys)', () => {
        const TTL = getNumber();
        const KEYS = getNames();
        const KEY_NAMES = KEYS.join('');

        class TestType {
            @Cache(TTL, ...KEYS)
            prop = 0;
        }

        test(`should set '${METADATA.COMMON.CACHE_TTL}' to ${TTL}`, () => {
            const ttl = Reflect.getMetadata(METADATA.COMMON.CACHE_TTL, TestType.prototype, 'prop');
            expect(ttl).toBe(TTL);
        });

        test(`should set '${METADATA.COMMON.CACHE_KEYS}' to [${KEY_NAMES}]`, () => {
            const keys = Reflect.getMetadata(METADATA.COMMON.CACHE_KEYS, TestType.prototype, 'prop');
            expect(keys).toEqual(KEYS);
        });
    });
});
