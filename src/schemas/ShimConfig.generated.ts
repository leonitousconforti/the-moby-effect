import * as Schema from "@effect/schema/Schema";

export class ShimConfig extends Schema.Class<ShimConfig>("ShimConfig")({
    Binary: Schema.String,
    Opts: object,
}) {}
