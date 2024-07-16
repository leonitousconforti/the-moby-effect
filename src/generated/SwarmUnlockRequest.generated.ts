import * as Schema from "@effect/schema/Schema";

export class SwarmUnlockRequest extends Schema.Class<SwarmUnlockRequest>("SwarmUnlockRequest")(
    {
        UnlockKey: Schema.String,
    },
    {
        identifier: "SwarmUnlockRequest",
        title: "swarm.UnlockRequest",
    }
) {}
