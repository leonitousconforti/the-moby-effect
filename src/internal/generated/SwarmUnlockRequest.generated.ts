import * as Schema from "effect/Schema";

export class SwarmUnlockRequest extends Schema.Class<SwarmUnlockRequest>("SwarmUnlockRequest")(
    {
        UnlockKey: Schema.String,
    },
    {
        identifier: "SwarmUnlockRequest",
        title: "swarm.UnlockRequest",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#UnlockRequest",
    }
) {}
