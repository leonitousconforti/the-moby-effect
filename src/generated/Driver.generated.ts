import * as Schema from "@effect/schema/Schema";

export class Driver extends Schema.Class<Driver>("Driver")(
    {
        Name: Schema.optional(Schema.String),
        Options: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
    },
    {
        identifier: "Driver",
        title: "mount.Driver",
        documentation:
            "https://github.com/moby/moby/blob/733755d7cb18a4dbea7c290cc56e61d05502aca0/api/types/mount/mount.go#L103-L107",
    }
) {}
