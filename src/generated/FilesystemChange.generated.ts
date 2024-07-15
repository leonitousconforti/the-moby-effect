import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class FilesystemChange extends Schema.Class<FilesystemChange>("FilesystemChange")(
    {
        Kind: Schema.NullOr(MobySchemas.UInt8),
        Path: Schema.NullOr(Schema.String),
    },
    {
        identifier: "FilesystemChange",
        title: "container.FilesystemChange",
    }
) {}
