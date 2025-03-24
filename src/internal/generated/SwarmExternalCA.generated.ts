import * as Schema from "effect/Schema";

export class SwarmExternalCA extends Schema.Class<SwarmExternalCA>("SwarmExternalCA")(
    {
        Protocol: Schema.String,
        URL: Schema.String,
        Options: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),
        CACert: Schema.String,
    },
    {
        identifier: "SwarmExternalCA",
        title: "swarm.ExternalCA",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/swarm.go#L135-L150",
    }
) {}
