import { METADATA, TYPE_ID } from '@/constants';
import { UnionType } from '@/decorators';

import { getName, getTypeNames } from '../../helpers';

describe('Decorator: Union Type', () => {
    class TestType1 {}
    class TestType2 {}

    const TYPE_NAME = getName();
    const TYPE_NAMES = getTypeNames(TestType1, TestType2);

    describe('@UnionType()', () => {
        @UnionType()
        class TestType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.UNION}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestType);
            expect(id).toBe(TYPE_ID.UNION);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TestType.name}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestType);
            expect(name).toBe(TestType.name);
        });

        test(`should set '${METADATA.UNION.TYPES}' to []`, () => {
            const types = Reflect.getMetadata(METADATA.UNION.TYPES, TestType);
            expect(types).toEqual([]);
        });
    });

    describe('@UnionType(name)', () => {
        @UnionType(TYPE_NAME)
        class TestType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.UNION}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestType);
            expect(id).toBe(TYPE_ID.UNION);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TYPE_NAME}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestType);
            expect(name).toBe(TYPE_NAME);
        });

        test(`should set '${METADATA.UNION.TYPES}' to []`, () => {
            const types = Reflect.getMetadata(METADATA.UNION.TYPES, TestType);
            expect(types).toEqual([]);
        });
    });

    describe('@UnionType(types)', () => {
        @UnionType(TestType1, TestType2)
        class TestType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.UNION}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestType);
            expect(id).toBe(TYPE_ID.UNION);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TestType.name}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestType);
            expect(name).toBe(TestType.name);
        });

        test(`should set '${METADATA.UNION.TYPES}' to [${TYPE_NAMES}]`, () => {
            const types = Reflect.getMetadata(METADATA.UNION.TYPES, TestType);
            expect(types).toEqual([TestType1, TestType2]);
        });
    });

    describe('@UnionType(name, types)', () => {
        @UnionType(TYPE_NAME, TestType1, TestType2)
        class TestType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.UNION}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestType);
            expect(id).toBe(TYPE_ID.UNION);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TYPE_NAME}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestType);
            expect(name).toBe(TYPE_NAME);
        });

        test(`should set '${METADATA.UNION.TYPES}' to [${TYPE_NAMES}]`, () => {
            const types = Reflect.getMetadata(METADATA.UNION.TYPES, TestType);
            expect(types).toEqual([TestType1, TestType2]);
        });
    });
});
