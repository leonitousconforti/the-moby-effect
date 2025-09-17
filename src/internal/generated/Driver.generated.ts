import * as Schema from "effect/Schema";

export class Driver extends Schema.Class<Driver>("Driver")(
    {
        Name: Schema.optional(Schema.String),
        Options: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
    },
    {
        identifier: "Driver",
        title: "mount.Driver",
        documentation: "",
    }
) {}
