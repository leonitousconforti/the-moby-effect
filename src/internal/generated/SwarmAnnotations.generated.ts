import * as Schema from "effect/Schema";

export class SwarmAnnotations extends Schema.Class<SwarmAnnotations>("SwarmAnnotations")(
    {
        Name: Schema.optional(Schema.String),
        Labels: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
    },
    {
        identifier: "SwarmAnnotations",
        title: "swarm.Annotations",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/common.go#L25-L29",
    }
) {}
