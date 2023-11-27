/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("node:fs");
const path = require("node:path");
const prettier = require("prettier");

const outputDirectory = path.join(__dirname, "../src");
const templateDirectory = path.join(__dirname, "../src");
const swaggerFile = path.join(__dirname, "swagger.yaml");
const swaggerConfig = path.join(__dirname, "swagger-gen.json");
const swaggerJar = path.join(__dirname, "swagger-codegen-cli.jar");
const pruneGlob = [`${outputDirectory}/!(*.mustache|api.ts)`, `${outputDirectory}/.*`];

module.exports.runAsync = async () => {
    const { $ } = await import("execa");
    const { rimraf } = await import("rimraf");

    await $`java -jar ${swaggerJar} generate --lang typescript-fetch --template-engine mustache --input-spec ${swaggerFile} --config ${swaggerConfig} --output ${outputDirectory} --template-dir ${templateDirectory}`;
    await rimraf(pruneGlob, { glob: true });

    const prettierOptions = {
        parser: "typescript",
        ...(await prettier.resolveConfig(process.cwd(), { editorconfig: true })),
    };

    const source = fs.readFileSync(`${outputDirectory}/api.ts`, "utf8");
    const formattedSource = await prettier.format(source, prettierOptions);
    fs.writeFileSync(`${outputDirectory}/api.ts`, formattedSource, "utf8");
};
