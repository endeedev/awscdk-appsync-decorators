import { TypeStore } from '@/core';

import { getName } from '../helpers';

describe('Core: Type Store', () => {
    test(`should register and return item`, () => {
        const NAME = getName();
        const OBJECT = {};

        const store = new TypeStore<object>();

        // Register the type
        store.registerType(NAME, OBJECT);

        // Check the type is returned
        const obj = store.getType(NAME);

        expect(obj).toEqual(OBJECT);
    });
});
