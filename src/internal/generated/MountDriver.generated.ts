import * as Schema from "effect/Schema";

export class MountDriver extends Schema.Class<MountDriver>("MountDriver")(
    {
        Name: Schema.optional(Schema.String),
        Options: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
    },
    {
        identifier: "MountDriver",
        title: "mount.Driver",
        documentation: "",
    }
) {}
