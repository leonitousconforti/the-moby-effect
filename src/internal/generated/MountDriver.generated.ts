import * as Schema from "effect/Schema";

export class MountDriver extends Schema.Class<MountDriver>("MountDriver")(
    {
        Name: Schema.optional(Schema.String),
        Options: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
    },
    {
        identifier: "MountDriver",
        title: "mount.Driver",
        documentation: "",
    }
) {}
