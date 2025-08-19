import { ArgInfo, FieldInfo, ModifierInfo, PropertyInfo, Scalar, Type, TypeInfo } from '@/common';
import { METADATA, TYPE_ID } from '@/constants';

interface ReflectedProperty {
    readonly property: PropertyInfo;
    readonly modifiers: ModifierInfo;
}

const SCALARS = Object.values(Scalar);

export class TypeReflector {
    static getTypeInfo(type: Scalar | Type<object>): TypeInfo {
        // Define the type info if the type is a scalar
        if (this.isScalar(`${type}`)) {
            return {
                typeId: TYPE_ID.SCALAR,
                typeName: `${type}`,
                definitionType: type as Type<object>,
            };
        }

        // Otherwise reflect the type for type metadata
        const typeId = Reflect.getMetadata(METADATA.TYPE.ID, type);
        const typeName = Reflect.getMetadata(METADATA.TYPE.NAME, type);

        return {
            typeId,
            typeName,
            definitionType: type as Type<object>,
        };
    }

    static getFieldInfos(type: TypeInfo): FieldInfo[] {
        const { definitionType } = type;

        const fields: FieldInfo[] = [];
        const instance = new definitionType();

        // Reflect each property of the provided type
        for (const [name, value] of Object.entries(instance)) {
            const { property, modifiers } = this.reflectProperty(type, name, value);

            const args = this.getArgInfos(property);

            fields.push({
                property,
                args,
                modifiers,
            });
        }

        return fields;
    }

    private static getArgInfos(property: PropertyInfo): ArgInfo[] {
        const {
            propertyName,
            declaringType: {
                definitionType: { prototype },
            },
        } = property;

        // Get the type defined by the args decorator
        const argsType = Reflect.getMetadata(METADATA.COMMON.ARGS, prototype, propertyName);

        const args: ArgInfo[] = [];

        // If defined, then reflect each property of the provided arg type
        if (argsType) {
            const instance = new argsType();

            const type = this.getTypeInfo(argsType);
            
            for (const [name, value] of Object.entries(instance)) {
                const { property, modifiers } = this.reflectProperty(type, name, value);

                args.push({
                    property,
                    modifiers,
                });
            }
        }

        return args;
    }

    private static reflectProperty(type: TypeInfo, name: string, value: unknown): ReflectedProperty {
        const {
            definitionType: { prototype },
        } = type;

        // Determine the property setup
        const isArray = Array.isArray(value);
        const isList = Reflect.hasMetadata(METADATA.COMMON.LIST, prototype, name);
        const isRequired = Reflect.hasMetadata(METADATA.COMMON.REQUIRED, prototype, name);
        const isRequiredList = Reflect.hasMetadata(METADATA.COMMON.REQUIRED_LIST, prototype, name);

        // If the value is an array take the first element as the property type
        let propertyType = value;

        if (isArray) {
            const [first] = Array.from(value);
            propertyType = first;
        }

        return {
            property: {
                propertyType: this.getTypeInfo(propertyType as Type<object>),
                propertyName: name,
                declaringType: type,
            },
            modifiers: {
                isList: isArray || isList || isRequiredList,
                isRequired,
                isRequiredList,
            },
        };
    }

    private static isScalar(type: string): boolean {
        if (type === Scalar.INTERMEDIATE) {
            throw new Error(`Unable to map properties of type '${Scalar.INTERMEDIATE}'.`);
        }

        return SCALARS.indexOf(type as Scalar) > -1;
    }
}
