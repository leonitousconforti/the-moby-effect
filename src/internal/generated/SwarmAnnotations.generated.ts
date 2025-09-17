import * as Schema from "effect/Schema";

export class SwarmAnnotations extends Schema.Class<SwarmAnnotations>("SwarmAnnotations")(
    {
        Name: Schema.optional(Schema.String),
        Labels: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
    },
    {
        identifier: "SwarmAnnotations",
        title: "swarm.Annotations",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Annotations",
    }
) {}
