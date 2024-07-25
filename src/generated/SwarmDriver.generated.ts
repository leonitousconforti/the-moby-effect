import * as Schema from "@effect/schema/Schema";

export class SwarmDriver extends Schema.Class<SwarmDriver>("SwarmDriver")(
    {
        Name: Schema.optional(Schema.String),
        Options: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),
    },
    {
        identifier: "SwarmDriver",
        title: "swarm.Driver",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/common.go#L31-L35",
    }
) {}
