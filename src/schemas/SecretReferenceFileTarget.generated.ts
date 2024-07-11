import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class SecretReferenceFileTarget extends Schema.Class<SecretReferenceFileTarget>("SecretReferenceFileTarget")({
    Name: Schema.String,
    UID: Schema.String,
    GID: Schema.String,
    Mode: MobySchemas.UInt32,
}) {}
