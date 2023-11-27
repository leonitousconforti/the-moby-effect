// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("node:path");

const outputDirectory = path.join(__dirname, "../src");
const templateDirectory = path.join(__dirname, "../src");
const swaggerFile = path.join(__dirname, "swagger.yaml");
const swaggerConfig = path.join(__dirname, "swagger-gen.json");
const swaggerJar = path.join(__dirname, "swagger-codegen-cli.jar");
const pruneGlob = [`${outputDirectory}/!(api.mustache|api.ts)`, `${outputDirectory}/.*`];

module.exports.runAsync = async () => {
    const { $ } = await import("execa");
    const { rimraf } = await import("rimraf");

    await $`java -jar ${swaggerJar} generate --lang typescript-fetch --template-engine mustache --input-spec ${swaggerFile} --config ${swaggerConfig} --output ${outputDirectory} --template-dir ${templateDirectory}`;
    await rimraf(pruneGlob, { glob: true });
};
