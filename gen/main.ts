import SwaggerParser from "@apidevtools/swagger-parser";
import eslint from "eslint";
import fs from "node:fs/promises";
import OpenApi from "openapi-types";
import prettier from "prettier";

import { genAllOfType } from "./all-of.js";
import { genArrayType } from "./array.js";
import { genEnumType } from "./enum.js";
import { genObjectType } from "./object.js";
import { genPrimitiveType, primitiveTypeMappings } from "./primitives.js";
import { ISchemaDefinition } from "./types.js";

// @ts-expect-error
const mobySchema: OpenApi.OpenAPIV2.Document<{}> = await SwaggerParser.validate(
    "https://raw.githubusercontent.com/moby/moby/master/api/swagger.yaml"
);

// Parse out some parts of the schema we are interested in
const definitions = mobySchema.definitions || {};

/** Recursive helper to generate the schema for the definitions */
export const genSchemaType = (definition: ISchemaDefinition): [thisLevel: string, hoistedValues: string[]] => {
    if (definition.enum) {
        return genEnumType(definition);
    } else if (definition.type === "array") {
        return genArrayType(definition);
    } else if (definition.type === "object") {
        return genObjectType(definition);
    } else if (definition.allOf) {
        return genAllOfType(definition);
    } else if (primitiveTypeMappings[definition.type as keyof typeof primitiveTypeMappings]) {
        return genPrimitiveType(definition);
    } else {
        throw new Error(`Unknown type: ${definition.type}`);
    }
};

const prettierOptions: prettier.Options = {
    parser: "typescript",
    ...(await prettier.resolveConfig(import.meta.url, { editorconfig: true })),
};

let a = "";
let b = new Set<string>();

for (const [topLevel, hoisted] of Object.entries(definitions).map(([definitionName, definition]) =>
    genSchemaType({ ...definition, name: definitionName })
)) {
    a += topLevel + "\n\n";
    b = new Set([...b, ...hoisted]);
}

const source1 = await prettier.format(
    'import { Schema } from "@effect/schema";\n\n' + [...b.values()].join("\n\n") + "\n\n" + a,
    prettierOptions
);

// call eslint to format the file and load my eslint config from the root
const source2 = new eslint.ESLint({ fix: true, useEslintrc: true });
const result = await source2.lintText(source1, { filePath: "src/schemas.ts" });
await fs.writeFile("src/schemas.ts", result[0]?.output!);
