import { faker } from '@faker-js/faker';

import { Scalar, Type } from '@/common';
import { TypeReflector } from '@/core';

export const getNumber = () => faker.number.int();

export const getName = () => faker.word.sample();

export const getNames = () => faker.helpers.multiple(() => getName());

export const getTypeNames = (...types: Type<object>[]) => types.map(({ name }) => name).join(', ');

export const getTypeInfos = (...types: (Scalar | Type<object>)[]) =>
    types.map((type) => TypeReflector.getTypeInfo(type));

export const getScalar = () => {
    const scalar = Object.values(Scalar).filter((scalar) => scalar !== Scalar.INTERMEDIATE);
    return faker.helpers.arrayElement(scalar);
};
