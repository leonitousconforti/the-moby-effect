const path = require("path");

module.exports = () => ({
    target: "node",
    mode: "production",
    resolve: { extensions: [".js", ".json"] },
    externals: ["bufferutil", "utf-8-validate"],
    entry: path.join(__dirname, "dist", "bin", "cli.js"),
    module: { rules: [{ test: /\.node$/, loader: "node-loader" }] },
    output: { path: path.join(__dirname, "dist", "cli"), filename: "cli.cjs" },
});
