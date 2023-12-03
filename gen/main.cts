const fs = require("node:fs");
const path = require("node:path");
const { version } = require("../package.json");

const outputDirectory = path.join(__dirname, "..", "src");
const templateDirectory = path.join(__dirname, "..", "gen");
const configFile = path.join(__dirname, "..", "gen", "swagger.json");
const swaggerJar = path.join(__dirname, "..", "temp", "swagger-codegen-cli.jar");
const swaggerFile = `https://docs.docker.com/reference/engine/v${version.split(".").slice(0, 2).join(".")}.yaml`;
const swaggerCodegenJar =
    "https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.51/swagger-codegen-cli-3.0.51.jar";

// This file has to be in commonJS format so that it can be ran by Heft (build system)
module.exports.runAsync = async () => {
    const { $ } = await import("execa");
    const { rimraf } = await import("rimraf");
    const prettier = await import("prettier");

    // Run swagger codegen and delete any unwanted files after
    await $`wget ${swaggerCodegenJar} -O temp/swagger-codegen-cli.jar`;
    await $`java -jar ${swaggerJar} generate --lang typescript-fetch --template-engine mustache --input-spec ${swaggerFile} --output ${outputDirectory} --template-dir ${templateDirectory} --config ${configFile}`;
    await rimraf([`${outputDirectory}/!(api.ts|*.json)`, `${outputDirectory}/.*`], { glob: true });

    // Manual formatting of the source code
    const source: string = fs
        .readFileSync(`${outputDirectory}/api.ts`, "utf8")

        // Turn all Object types into void and any into unknown
        .replaceAll(/body: Object/gm, "body: unknown")
        .replaceAll(/body\?: Object/gm, "body?: unknown")
        .replaceAll(/Array<Array<(\w+)>>Schema/gm, "arraySchema(arraySchema($1Schema))")
        .replaceAll(/Array<(\w+)>Schema/gm, "arraySchema($1Schema)")
        .replaceAll(/: any/gm, ": unknown")
        .replaceAll(/Readonly<any>/gm, "Readonly<unknown>")
        .replaceAll(/Promise<{}>/gm, "Promise<void>")
        .replaceAll(/Promise<any>/gm, "Promise<unknown>")
        .replaceAll(/Effect.Effect<never, (\w+), {}>/gm, "Effect.Effect<never, $1, void>")
        .replaceAll(/Effect.Effect<never, (\w+), any>/gm, "Effect.Effect<never, $1, unknown>")

        // edge cases
        .replaceAll(/Schema.extend\(([\s\w(),]+), Schema.struct\({\n}\)\n\)/gm, "$1")
        .replaceAll(/{ \[key: (\w+)]: (\w+); }Schema/gm, "recordSchema($1Schema, $2Schema)")
        .replaceAll(/null<String, string>Schema/gm, "recordSchema(stringSchema, stringSchema)")
        .replaceAll(/null<String, Array>Schema/gm, "recordSchema(stringSchema, arraySchema(unknownSchema))")
        .replaceAll(
            /: (ChangeType|Reachability|NodeState|TaskState|LocalNodeState)Schema.pipe\(/gm,
            ": Schema.enums($1).pipe("
        )
        .replaceAll(
            /Effect.flatMap\(NodeHttp.response.schemaBodyJson\(BlobSchema\)\)/gm,
            "Effect.flatMap((clientResponse) => clientResponse.text),Effect.map((responseText) => new Blob([responseText]))"
        );

    // Split the source code into sections
    const sections: string[] = source.split("// section: ");
    const headerSection: string | undefined = sections.at(0);
    const implementationSection: string | undefined = sections.at(-1)?.split("\n").slice(1).join("\n");
    const schemaSections: { sectionName: string; source: string; dependencies: Set<string> }[] = sections
        .slice(1)
        .map((section) => section.split("\n"))
        .map(([sectionName, ...source]) => ({ sectionName: sectionName!, source: source.join("\n") }))
        .filter(({ sectionName }) => sectionName !== "api")
        .map((data, _index, allSections) => ({
            ...data,
            dependencies: allSections
                .map(({ sectionName }) => sectionName)
                .filter(
                    (dep) =>
                        data.source.includes(`: ${dep}.pipe(`) ||
                        data.source.includes(`: arraySchema(${dep})`) ||
                        data.source.includes(`: Schema.enums(${dep}).pipe(`) ||
                        data.source.includes(` = ${dep}`) ||
                        data.source.includes(` = arraySchema(${dep})`) ||
                        data.source.includes(`Schema.extend(${dep}, `) ||
                        data.source.includes(`Schema.extend(arraySchema(${dep}), `) ||
                        data.source.includes(`recordSchema(stringSchema, ${dep}).pipe(`)
                ),
        }))
        .map(({ dependencies, sectionName, ...rest }) => ({
            ...rest,
            sectionName,
            dependencies: new Set(dependencies.filter((dep) => dep !== sectionName)),
        }));

    // Sanity check
    if (!headerSection || !implementationSection || schemaSections.length === 0)
        throw new Error("Could not find header or implementation or schema sections");

    // Recursive helper to put the sections in the right order
    type t = { sectionName: string; source: string; dependencies: Set<string> };
    const orderSections = (sectionsToProcess: t[]): t[] => {
        if (sectionsToProcess.length === 0) return [];

        const sectionsWithNoDependencies: t[] = sectionsToProcess.filter(({ dependencies }) => dependencies.size === 0);
        if (sectionsWithNoDependencies.length === 0) throw new Error("Circular dependency detected");

        const newCompletedSections: Set<string> = new Set(
            sectionsWithNoDependencies.map(({ sectionName }) => sectionName)
        );

        const newSectionsToProcess = sectionsToProcess
            .filter((x) => !sectionsWithNoDependencies.includes(x))
            .map(({ dependencies, ...rest }) => ({
                ...rest,
                dependencies: new Set([...dependencies].filter((dep) => !newCompletedSections.has(dep))),
            }));

        return [...sectionsWithNoDependencies, ...orderSections(newSectionsToProcess)];
    };

    // Order the schema section so dependencies are in the right order
    const orderedSchemaSection = orderSections(schemaSections)
        .map(({ source }) => source)
        .join("\n");

    // Make everything pretty
    const prettierOptions = {
        parser: "typescript",
        ...(await prettier.resolveConfig(__dirname, { editorconfig: true })),
    };
    const formattedSource = await prettier.format(
        headerSection + orderedSchemaSection + implementationSection,
        prettierOptions
    );

    // Save our work
    fs.writeFileSync(`${outputDirectory}/api.ts`, formattedSource, "utf8");
};
