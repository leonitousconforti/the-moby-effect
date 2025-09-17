import * as Schema from "effect/Schema";

export class SwarmDriver extends Schema.Class<SwarmDriver>("SwarmDriver")(
    {
        Name: Schema.optional(Schema.String),
        Options: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
    },
    {
        identifier: "SwarmDriver",
        title: "swarm.Driver",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Driver",
    }
) {}
