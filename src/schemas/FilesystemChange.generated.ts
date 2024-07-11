import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class FilesystemChange extends Schema.Class<FilesystemChange>("FilesystemChange")({
    Kind: MobySchemas.UInt8,
    Path: Schema.String,
}) {}
