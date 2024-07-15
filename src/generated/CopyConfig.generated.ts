import * as Schema from "@effect/schema/Schema";

export class CopyConfig extends Schema.Class<CopyConfig>("CopyConfig")(
    {
        Resource: Schema.NullOr(Schema.String),
    },
    {
        identifier: "CopyConfig",
        title: "types.CopyConfig",
    }
) {}
