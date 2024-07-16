import * as Schema from "@effect/schema/Schema";

export class Driver extends Schema.Class<Driver>("Driver")(
    {
        Name: Schema.optional(Schema.String),
        Options: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
    },
    {
        identifier: "Driver",
        title: "mount.Driver",
    }
) {}
