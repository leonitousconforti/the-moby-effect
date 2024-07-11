import * as Schema from "@effect/schema/Schema";

export class CopyConfig extends Schema.Class<CopyConfig>("CopyConfig")({
    Resource: Schema.String,
}) {}
