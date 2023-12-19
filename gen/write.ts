import eslint from "eslint";
import fs from "node:fs/promises";
import prettier from "prettier";

const prettierOptions: prettier.Options = {
    parser: "typescript",
    ...(await prettier.resolveConfig(import.meta.url, { editorconfig: true })),
};

export const writeAndSave = async (path: string, source: string) => {
    try {
        const source1 = await prettier.format(source, prettierOptions);

        const source2 = new eslint.ESLint({ fix: true, useEslintrc: true });
        const result = await source2.lintText(source1, { filePath: path });

        if (process.env["NODE_ENV"] === "development") {
            await fs.writeFile(path, result[0]?.output!);
        }
    } catch {
        console.log(`${path} formatting failed`);
        await fs.writeFile(path, source);
    }
};

// else if (
//     result[0]?.fatalErrorCount ||
//     result[0]?.output !== (await fs.readFile(url.fileURLToPath(new URL("../src/schemas.ts", import.meta.url)), "utf8"))
// ) {
//     throw new Error(`Schema generation failed, fatalErrors=${result[0]?.fatalErrorCount}`);
// }
