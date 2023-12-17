import type { ISchemaDefinition } from "./types.js";

import { genSchemaType } from "./main.js";

/**
 * All of is basically an object that has all the properties of the children. In
 * this case, we generate a type for every child, then we hoist but do not
 * export those children types. This is so that the base class can extend all
 * them without having to define additional properties on itself to store them
 */
export const genAllOfType = (definition: ISchemaDefinition): [thisLevel: string, hoistedValues: string[]] => {
    const children = (definition.allOf || []) as ISchemaDefinition[];

    const [allOf, hoistedValues] = children
        .map((value, index) =>
            genSchemaType({
                ...value,
                parent:
                    index === 0
                        ? undefined
                        : ({ name: `${definition.name}_${index - 1}`, allOf: [] } as ISchemaDefinition),
                name: `${definition.name}_${index}`,
            })
        )
        .map(([thisLevel, hoistedValues], index) =>
            index === 0
                ? ([thisLevel, hoistedValues] as const)
                : ([
                      `export class ${definition.name}_${index} extends ${definition.name}_${index - 1}.extend<${
                          definition.name
                      }_${index}>()({ ${thisLevel.replace("Schema.struct({", "").slice(0, -2)} }) {}`,
                      hoistedValues,
                  ] as const)
        )
        .reduce(
            ([previousAllOf, previousHoistedValues], [thisLevel, hoistedValues]) => [
                [...previousAllOf, thisLevel],
                [...previousHoistedValues, ...hoistedValues],
            ],
            [[] as string[], [] as string[]]
        );

    if (definition.parent) {
        throw new Error("AllOf should not have a parent");
    }

    if (definition.default) {
        throw new Error("AllOf defaults are not implemented");
    }

    return [
        `export class ${definition.name} extends ${definition.name}_${children.length - 1}.extend<${
            definition.name
        }>()({}) {}`,
        [...hoistedValues, ...allOf],
    ];
};
