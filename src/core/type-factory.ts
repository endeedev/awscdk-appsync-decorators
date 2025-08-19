import {
    CodeFirstSchema,
    EnumType,
    IIntermediateType,
    InputType,
    InterfaceType,
    ObjectType,
    ResolvableField,
    Type as TypeBase,
    UnionType,
} from 'awscdk-appsync-utils';

import { ArgInfo, GraphqlType, ModifierInfo, Type, TypeInfo } from '@/common';
import { METADATA, TYPE_ID } from '@/constants';

import { TypeReflector } from './type-reflector';

type TypeFields = Record<string, ResolvableField>;
type TypeFieldArgs = Record<string, GraphqlType>;

type IntermediateTypeCache = Record<string, IIntermediateType>;
type IntermediateTypeFactory = (typeInfo: TypeInfo, schema: CodeFirstSchema) => IIntermediateType;

interface RootType {
    readonly fields: TypeFields;
}

export class TypeFactory {
    private _typeCache: IntermediateTypeCache;
    private _typeFactories: Record<string, IntermediateTypeFactory>;

    constructor(typeCache?: IntermediateTypeCache) {
        // Initialize the cache
        this._typeCache = typeCache ?? {};

        // Register the factories
        this._typeFactories = {
            [TYPE_ID.ENUM]: this.createEnumType.bind(this),
            [TYPE_ID.INPUT]: this.createInputType.bind(this),
            [TYPE_ID.INTERFACE]: this.createInterfaceType.bind(this),
            [TYPE_ID.OBJECT]: this.createObjectType.bind(this),
            [TYPE_ID.UNION]: this.createUnionType.bind(this),
        };
    }

    createRootType(typeId: string, type: Type<object>, schema: CodeFirstSchema): RootType {
        const fields = this.createFields(
            {
                typeId,
                typeName: typeId,
                definitionType: type,
            },
            schema,
        );

        return {
            fields,
        };
    }

    private createType(typeInfo: TypeInfo, modifierInfo: ModifierInfo, schema: CodeFirstSchema): GraphqlType {
        const { typeId, definitionType } = typeInfo;

        // Build scalar types separately
        if (typeId === TYPE_ID.SCALAR) {
            return new GraphqlType(`${definitionType}` as TypeBase, {
                ...modifierInfo,
            });
        }

        // Build any non-scalar types and define the intermediate type
        return new GraphqlType(TypeBase.INTERMEDIATE, {
            intermediateType: this.createIntermediateType(typeInfo, schema),
            ...modifierInfo,
        });
    }

    private createFields(typeInfo: TypeInfo, schema: CodeFirstSchema): TypeFields {
        const fieldInfos = TypeReflector.getFieldInfos(typeInfo);

        return fieldInfos.reduce(
            (output, { propertyInfo: { propertyName, returnTypeInfo }, modifierInfo, argInfos }) => {
                const returnType = this.createType(returnTypeInfo, modifierInfo, schema);
                const args = this.createArgs(argInfos, schema);

                return {
                    ...output,
                    [propertyName]: new ResolvableField({
                        returnType,
                        args,
                    }),
                };
            },
            {},
        );
    }

    private createArgs(argInfos: ArgInfo[], schema: CodeFirstSchema): TypeFieldArgs | undefined {
        if (argInfos.length === 0) {
            return undefined;
        }

        return argInfos.reduce(
            (output, { propertyInfo: { propertyName, returnTypeInfo }, modifierInfo }) => ({
                ...output,
                [propertyName]: this.createType(returnTypeInfo, modifierInfo, schema),
            }),
            {},
        );
    }

    private createEnumType(typeInfo: TypeInfo): EnumType {
        const { typeName } = typeInfo;

        // A class decorated as an enum type will define properties for each enum value
        // Get those properties and map as a string array
        // Note that the value used for each property is ignored (purely to keep typescript happy)
        const fieldInfos = TypeReflector.getFieldInfos(typeInfo);

        return new EnumType(typeName, {
            definition: fieldInfos.map(({ propertyInfo: { propertyName } }) => propertyName),
        });
    }

    private createInputType(typeInfo: TypeInfo, schema: CodeFirstSchema): InputType {
        const { typeName } = typeInfo;

        // An input type requires a definition of fields and directives
        const definition = this.createFields(typeInfo, schema);

        return new InputType(typeName, {
            definition,
        });
    }

    private createInterfaceType(typeInfo: TypeInfo, schema: CodeFirstSchema): InterfaceType {
        const { typeName } = typeInfo;

        // An interface type requires a definition of fields and directives
        const definition = this.createFields(typeInfo, schema);

        return new InterfaceType(typeName, {
            definition,
        });
    }

    private createObjectType(typeInfo: TypeInfo, schema: CodeFirstSchema): ObjectType {
        const { typeName } = typeInfo;

        // An object type requires a definition of fields and directives
        const definition = this.createFields(typeInfo, schema);

        // An object type can also implement interfaces
        // Get any defined types and map to their intermediate types
        const typeInfos = TypeReflector.getMetadataTypeInfos(typeInfo, METADATA.OBJECT.TYPES);

        return new ObjectType(typeName, {
            definition,
            interfaceTypes:
                typeInfos.length === 0
                    ? undefined
                    : typeInfos.map((typeInfo) => this.createIntermediateType(typeInfo, schema)),
        });
    }

    private createUnionType(typeInfo: TypeInfo, schema: CodeFirstSchema): UnionType {
        const { typeName } = typeInfo;

        // A union type decorator will define the classes to use
        // Get those associated types and map to their intermediate types
        const typeInfos = TypeReflector.getMetadataTypeInfos(typeInfo, METADATA.UNION.TYPES);

        return new UnionType(typeName, {
            definition: typeInfos.map((typeInfo) => this.createIntermediateType(typeInfo, schema)),
        });
    }

    private createIntermediateType(typeInfo: TypeInfo, schema: CodeFirstSchema): IIntermediateType {
        const { typeId, typeName } = typeInfo;

        // Lookup the type in the cache
        let intermediateType = this._typeCache[typeName];

        // If not found, create a definition and add to the cache
        if (!intermediateType) {
            const factory = this._typeFactories[typeId];

            intermediateType = factory(typeInfo, schema);

            this._typeCache[typeName] = intermediateType;

            // Add the type to the schema definition
            schema.addType(intermediateType);
        }

        return intermediateType;
    }
}
