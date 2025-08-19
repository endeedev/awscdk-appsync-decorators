import { METADATA, TYPE_ID } from '@/constants';
import { UnionType } from '@/decorators';

class TestObject1 {}
class TestObject2 {}

const UNION_NAME = 'CustomTestUnion';
const OBJECT_NAMES = [TestObject1.name, TestObject2.name].join(', ');

describe('Decorator: Union Type', () => {
    describe('@UnionType()', () => {
        @UnionType()
        class TestUnionType {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.UNION}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestUnionType);
            expect(id).toBe(TYPE_ID.UNION);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TestUnionType.name}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestUnionType);
            expect(name).toBe(TestUnionType.name);
        });

        test(`should set '${METADATA.UNION.TYPES}' to []`, () => {
            const types = Reflect.getMetadata(METADATA.UNION.TYPES, TestUnionType);
            expect(types).toEqual([]);
        });
    });

    describe('@UnionType(name)', () => {
        @UnionType(UNION_NAME)
        class TestUnionTypeWithName {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.UNION}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestUnionTypeWithName);
            expect(id).toBe(TYPE_ID.UNION);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${UNION_NAME}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestUnionTypeWithName);
            expect(name).toBe(UNION_NAME);
        });

        test(`should set '${METADATA.UNION.TYPES}' to []`, () => {
            const types = Reflect.getMetadata(METADATA.UNION.TYPES, TestUnionTypeWithName);
            expect(types).toEqual([]);
        });
    });

    describe('@UnionType(types)', () => {
        @UnionType(TestObject1, TestObject2)
        class TestUnionTypeWithInterfaces {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.UNION}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestUnionTypeWithInterfaces);
            expect(id).toBe(TYPE_ID.UNION);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${TestUnionTypeWithInterfaces.name}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestUnionTypeWithInterfaces);
            expect(name).toBe(TestUnionTypeWithInterfaces.name);
        });

        test(`should set '${METADATA.UNION.TYPES}' to [${OBJECT_NAMES}]`, () => {
            const types = Reflect.getMetadata(METADATA.UNION.TYPES, TestUnionTypeWithInterfaces);
            expect(types).toEqual([TestObject1, TestObject2]);
        });
    });

    describe('@UnionType(name, types)', () => {
        @UnionType(UNION_NAME, TestObject1, TestObject2)
        class TestUnionTypeWithNameAndInterfaces {}

        test(`should set '${METADATA.TYPE.ID}' to '${TYPE_ID.UNION}'`, () => {
            const id = Reflect.getMetadata(METADATA.TYPE.ID, TestUnionTypeWithNameAndInterfaces);
            expect(id).toBe(TYPE_ID.UNION);
        });

        test(`should set '${METADATA.TYPE.NAME}' to '${UNION_NAME}'`, () => {
            const name = Reflect.getMetadata(METADATA.TYPE.NAME, TestUnionTypeWithNameAndInterfaces);
            expect(name).toBe(UNION_NAME);
        });

        test(`should set '${METADATA.UNION.TYPES}' to [${OBJECT_NAMES}]`, () => {
            const types = Reflect.getMetadata(METADATA.UNION.TYPES, TestUnionTypeWithNameAndInterfaces);
            expect(types).toEqual([TestObject1, TestObject2]);
        });
    });
});
