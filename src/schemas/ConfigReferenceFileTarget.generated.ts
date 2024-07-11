import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ConfigReferenceFileTarget extends Schema.Class<ConfigReferenceFileTarget>("ConfigReferenceFileTarget")({
    Name: Schema.String,
    UID: Schema.String,
    GID: Schema.String,
    Mode: MobySchemas.UInt32,
}) {}
