import { METADATA } from '../../constants';
import { SchemaType } from '../../types';

export function Arguments(type: SchemaType<object>): PropertyDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata(METADATA.COMMON.ARGUMENTS, type, target, propertyKey);
    };
}
