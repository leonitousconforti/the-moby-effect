import { genSchemaType } from "../index.js";
import type { AllOfSchema, ISchemaDefinition } from "../types.js";

/**
 * All of is basically an object that has all the properties of the children. In
 * this case, we generate a type for every child and then we hoist those
 * children types. This is so that the base class can extend all them without
 * having to define additional properties on itself to store them
 */
export const genAllOfType =
    (wholeSchema: { definitions: Record<string, ISchemaDefinition> }) =>
    (definition: AllOfSchema): [thisLevel: string, hoistedValues: string[]] => {
        if (definition["x-nullable"]) {
            throw new Error("AllOf nullable is not implemented");
        }

        if (definition.parent) {
            throw new Error("Non top level AllOfs are not implemented");
        }

        const children = definition.allOf || [];

        // For each child, generate its type. If this is not the first child, then
        // we specify the previous child as the parent.
        const [allOf, nestedHoistedValues] = children
            .map((value, index) => genSchemaType(wholeSchema)({ ...value, name: `${definition.name}_${index}` }))
            .map(([thisLevel, hoistedValues], index) =>
                index === 0
                    ? ([thisLevel, hoistedValues] as const)
                    : ([
                          thisLevel.replace(
                              `extends ${definition.name}_${index}`,
                              `extends ${definition.name}_${index - 1}.extend`
                          ),
                          hoistedValues,
                      ] as const)
            )
            // eslint-disable-next-line unicorn/no-array-reduce
            .reduce(
                ([previousAllOf, previousHoistedValues], [thisLevel, hoistedValues]) => [
                    [...previousAllOf, thisLevel],
                    [...previousHoistedValues, ...hoistedValues],
                ],
                [[] as string[], [] as string[]]
            );

        // It doesn't really matter that we return the base type at "this level"
        // instead of with the hoisted values because we have a no parent check
        // above this. But anyways, the ony type we return at this level is a
        // class that extends the last child class. All of the children classes
        // must be hoisted to the top level.
        return [
            `export class ${definition.name} extends ${definition.name}_${children.length - 1}.extend<${
                definition.name
            }>()({}) {}`,
            [...nestedHoistedValues, ...allOf],
        ];
    };
