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

        // Otherwise reflect the type metadata
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

    static getMetadataTypeInfos(typeInfo: TypeInfo, metadataKey: string): TypeInfo[] {
        const { definitionType } = typeInfo;

        // Get the types for the provided metadata key
        const types = Reflect.getMetadata(metadataKey, definitionType) as Type<object>[];

        return types.map((type) => this.getTypeInfo(type));
    }

    static getMetadataDirectiveInfos(typeInfo: TypeInfo, propertyInfo?: PropertyInfo): DirectiveInfo[] {
        const { definitionType } = typeInfo;

        // Get the directives for type or property
        const directiveIds = propertyInfo
            ? (Reflect.getMetadata(
                  METADATA.DIRECTIVE.IDS,
                  definitionType.prototype,
                  propertyInfo.propertyName,
              ) as string[])
            : (Reflect.getMetadata(METADATA.DIRECTIVE.IDS, definitionType) as string[]);

        return directiveIds.map((directiveId) => {
            const factory = this._directiveFactories[directiveId];
            const context = factory ? factory(typeInfo, propertyInfo) : undefined;

            return {
                directiveId,
                context,
            };
        });
    }

    private static getDirectiveContext(
        contextKey: string,
        metadataKey: string,
        typeInfo: TypeInfo,
        propertyInfo?: PropertyInfo,
    ): Record<string, unknown> {
        const { definitionType } = typeInfo;

        // Get the context values from the type or property metadata
        if (propertyInfo) {
            const { prototype } = definitionType;
            const { propertyName } = propertyInfo;

            return {
                [contextKey]: Reflect.getMetadata(metadataKey, prototype, propertyName),
            };
        }

        return {
            [contextKey]: Reflect.getMetadata(metadataKey, definitionType),
        };
    }

    private static getArgInfos(propertyInfo: PropertyInfo): ArgInfo[] {
        const {
            propertyName,
            declaringTypeInfo: {
                definitionType: { prototype },
            },
        } = propertyInfo;

        // Get the type defined by the args decorator
        const argsType = Reflect.getMetadata(METADATA.COMMON.ARGS, prototype, propertyName);

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
