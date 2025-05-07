import * as Schema from "effect/Schema";

export class Driver extends Schema.Class<Driver>("Driver")(
    {
        Name: Schema.optional(Schema.String),
        Options: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
    },
    {
        identifier: "Driver",
        title: "mount.Driver",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/mount/mount.go#L110-L114",
    }
) {}
