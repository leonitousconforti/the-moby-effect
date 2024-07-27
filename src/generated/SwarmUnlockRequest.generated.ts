import * as Schema from "@effect/schema/Schema";

export class SwarmUnlockRequest extends Schema.Class<SwarmUnlockRequest>("SwarmUnlockRequest")(
    {
        UnlockKey: Schema.String,
    },
    {
        identifier: "SwarmUnlockRequest",
        title: "swarm.UnlockRequest",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/swarm.go#L176-L180",
    }
) {}
