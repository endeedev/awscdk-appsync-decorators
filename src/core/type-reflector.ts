import { ArgInfo, DirectiveInfo, FieldInfo, ModifierInfo, PropertyInfo, Scalar, Type, TypeInfo } from '@/common';
import { DIRECTIVE_ID, METADATA, TYPE_ID } from '@/constants';

type DirectiveFactory = (typeInfo: TypeInfo, propertyInfo?: PropertyInfo) => Record<string, unknown>;

interface ReflectedProperty {
    readonly propertyInfo: PropertyInfo;
    readonly modifierInfo: ModifierInfo;
}

const SCALARS = Object.values(Scalar);

export class TypeReflector {
    private static _directiveFactories: Record<string, DirectiveFactory> = {
        [DIRECTIVE_ID.COGNITO]: (typeInfo, propertyInfo) =>
            this.getDirectiveContext('groups', METADATA.DIRECTIVE.COGNITO_GROUPS, typeInfo, propertyInfo),
        [DIRECTIVE_ID.CUSTOM]: (typeInfo, propertyInfo) =>
            this.getDirectiveContext('statement', METADATA.DIRECTIVE.CUSTOM_STATEMENT, typeInfo, propertyInfo),
    };

    static getTypeInfo(type: Scalar | Type<object>): TypeInfo {
        // Define the type info if the type is a scalar
        if (this.isScalar(`${type}`)) {
            return {
                typeId: TYPE_ID.SCALAR,
                typeName: `${type}`,
                definitionType: type as Type<object>,
            };
        }

        // Otherwise build the type info
        const typeId = Reflect.getMetadata(METADATA.TYPE.ID, type);
        const typeName = Reflect.getMetadata(METADATA.TYPE.NAME, type);

        return {
            typeId,
            typeName,
            definitionType: type as Type<object>,
        };
    }

    static getFieldInfos(typeInfo: TypeInfo): FieldInfo[] {
        const { definitionType } = typeInfo;

        const instance = new definitionType();

        // Reflect each property of the provided type
        const fieldInfos: FieldInfo[] = [];

        for (const [name, value] of Object.entries(instance)) {
            const { propertyInfo, modifierInfo } = this.reflectProperty(typeInfo, name, value);

            const argInfos = this.getArgInfos(propertyInfo);

            fieldInfos.push({
                propertyInfo,
                modifierInfo,
                argInfos,
            });
        }

        return fieldInfos;
    }

    static getMetadataTypeInfos(metadataKey: string, typeInfo: TypeInfo, propertyInfo?: PropertyInfo): TypeInfo[] {
        const types = this.getMetadata<Type<object>[]>(metadataKey, typeInfo, propertyInfo);

        if (types) {
            return types.map((type) => this.getTypeInfo(type));
        }

        return [];
    }

    static getMetadataDirectiveInfos(typeInfo: TypeInfo, propertyInfo?: PropertyInfo): DirectiveInfo[] {
        const directiveIds = this.getMetadata<string[]>(METADATA.DIRECTIVE.IDS, typeInfo, propertyInfo);

        if (directiveIds) {
            return directiveIds.map((directiveId) => {
                const factory = this._directiveFactories[directiveId];
                const context = factory ? factory(typeInfo, propertyInfo) : undefined;

                return {
                    directiveId,
                    context,
                };
            });
        }

        return [];
    }

    private static getDirectiveContext(
        contextKey: string,
        metadataKey: string,
        typeInfo: TypeInfo,
        propertyInfo?: PropertyInfo,
    ): Record<string, unknown> {
        if (propertyInfo) {
            return {
                [contextKey]: this.getMetadata(metadataKey, typeInfo, propertyInfo),
            };
        }

        return {
            [contextKey]: this.getMetadata(metadataKey, typeInfo),
        };
    }

    private static getArgInfos(propertyInfo: PropertyInfo): ArgInfo[] {
        const { declaringTypeInfo } = propertyInfo;

        // Get the type defined by the args decorator
        const argsType = this.getMetadata<Type<object>>(METADATA.COMMON.ARGS, declaringTypeInfo, propertyInfo);

        // If defined, then reflect each property of the provided args type
        const argInfos: ArgInfo[] = [];

        if (argsType) {
            const instance = new argsType();

            const typeInfo = this.getTypeInfo(argsType);

            for (const [name, value] of Object.entries(instance)) {
                const { propertyInfo, modifierInfo } = this.reflectProperty(typeInfo, name, value);

                argInfos.push({
                    propertyInfo,
                    modifierInfo,
                });
            }
        }

        return argInfos;
    }

    private static getMetadata<TMetadata>(
        metadataKey: string,
        typeInfo: TypeInfo,
        propertyInfo?: PropertyInfo,
    ): TMetadata | undefined {
        const { definitionType } = typeInfo;

        // First, validate the metadata has been define
        // Otherwise an error will be thrown
        const hasMetadata = propertyInfo
            ? Reflect.hasMetadata(metadataKey, definitionType.prototype, propertyInfo.propertyName)
            : Reflect.hasMetadata(metadataKey, definitionType);

        // If it exists, then get it
        if (hasMetadata) {
            return propertyInfo
                ? (Reflect.getMetadata(metadataKey, definitionType.prototype, propertyInfo.propertyName) as TMetadata)
                : (Reflect.getMetadata(metadataKey, definitionType) as TMetadata);
        }

        return undefined;
    }

    private static reflectProperty(typeInfo: TypeInfo, name: string, value: unknown): ReflectedProperty {
        const {
            definitionType: { prototype },
        } = typeInfo;

        // Determine the property setup
        const isArray = Array.isArray(value);
        const isList = Reflect.hasMetadata(METADATA.COMMON.LIST, prototype, name);
        const isRequired = Reflect.hasMetadata(METADATA.COMMON.REQUIRED, prototype, name);
        const isRequiredList = Reflect.hasMetadata(METADATA.COMMON.REQUIRED_LIST, prototype, name);

        // If the value is an array take the first element as the return type
        let returnType = value;

        if (isArray) {
            const [first] = Array.from(value);
            returnType = first;
        }

        return {
            propertyInfo: {
                propertyName: name,
                returnTypeInfo: this.getTypeInfo(returnType as Type<object>),
                declaringTypeInfo: typeInfo,
            },
            modifierInfo: {
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
