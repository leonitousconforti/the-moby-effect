import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ArchiveChange extends Schema.Class<ArchiveChange>("ArchiveChange")(
    {
        Path: Schema.String,
        Kind: MobySchemas.Int64,
    },
    {
        identifier: "ArchiveChange",
        title: "archive.Change",
        documentation: "",
    }
) {}
