import * as Schema from "@effect/schema/Schema";

export class SwarmAnnotations extends Schema.Class<SwarmAnnotations>("SwarmAnnotations")(
    {
        Name: Schema.optional(Schema.String),
        Labels: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
    },
    {
        identifier: "SwarmAnnotations",
        title: "swarm.Annotations",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/common.go#L25-L29",
    }
) {}
