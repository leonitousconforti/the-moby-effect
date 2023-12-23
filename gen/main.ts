import eslint from "eslint";
import fs from "node:fs/promises";

import { run } from "./index.js";
import { ISchemaDefinition } from "./types.js";

import mobySchema from "./openapi3_0.json" assert { type: "json" };

// Can't get my schema generator to generate this one type (its a body request type with allOf)
// Not gonna happen because it has no name so generate drops it because it doesn't know what to call it lol
const unableToGenerate = `
export class ContainerUpdateSpec extends Resources.extend<ContainerUpdateSpec>()({
    RestartPolicy: Schema.optional(RestartPolicy),
}) {}

export class ContainerCreateSpec extends ContainerConfig.extend<ContainerCreateSpec>()({
    HostConfig: Schema.optional(HostConfig),
    NetworkingConfig: Schema.optional(NetworkingConfig),
}) {}
`;

// Lets format the schema before we write it to disk
const intermediateSource =
    run(
        mobySchema as unknown as {
            components: { schemas: Record<string, ISchemaDefinition> };
            paths: Record<
                string,
                Record<
                    "get" | "post" | "delete" | "patch" | "options",
                    {
                        operationId: string;
                        responses: Record<
                            number,
                            {
                                content: Record<
                                    "application/json",
                                    { schema: { title?: string; items?: { title: string } } }
                                >;
                            }
                        >;
                        requestBody: {
                            content: Record<
                                "application/json",
                                { schema: { title?: string; items?: { title: string } } }
                            >;
                        };
                    }
                >
            >;
        }
    ) +
    "\n\n" +
    unableToGenerate;
const fixer = new eslint.ESLint({ fix: true, useEslintrc: true });
const prettiedSource = await fixer.lintText(intermediateSource, {
    filePath: "src/schemas.ts",
});

if (prettiedSource[0]?.fatalErrorCount) {
    await fs.writeFile("src/schemas.ts", `import * as Schema from "@effect/schema/Schema";\n\n${intermediateSource}`);
    throw new Error("Bad!");
} else {
    await fs.writeFile(
        "src/schemas.ts",
        `import * as Schema from "@effect/schema/Schema";\n\n${prettiedSource[0]?.output}`
    );
}
