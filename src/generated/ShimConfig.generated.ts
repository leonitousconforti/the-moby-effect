import * as Schema from "@effect/schema/Schema";

export class ShimConfig extends Schema.Class<ShimConfig>("ShimConfig")(
    {
        Binary: Schema.NullOr(Schema.String),
        Opts: Schema.Object,
    },
    {
        identifier: "ShimConfig",
        title: "types.ShimConfig",
    }
) {}
