import * as Schema from "effect/Schema";

export class SwarmExternalCA extends Schema.Class<SwarmExternalCA>("SwarmExternalCA")(
    {
        Protocol: Schema.Literal("cfssl"),
        URL: Schema.String,
        Options: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
        CACert: Schema.String,
    },
    {
        identifier: "SwarmExternalCA",
        title: "swarm.ExternalCA",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ExternalCA",
    }
) {}
