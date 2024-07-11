import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class PushResult extends Schema.Class<PushResult>("PushResult")({
    Tag: Schema.String,
    Digest: Schema.String,
    Size: MobySchemas.Int64,
}) {}
