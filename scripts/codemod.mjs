// @ts-check
import * as Glob from "glob";
import Jscodeshift from "jscodeshift/src/Runner.js";
import * as Path from "node:path";

const pattern = "src/**/*.ts";
const paths = Glob.globSync(pattern).map((path) => Path.resolve(path));
const transformer = Path.resolve("scripts/codemods/jsdoc.ts");

Jscodeshift.run(transformer, paths, {
    babel: true,
    parser: "ts",
});
