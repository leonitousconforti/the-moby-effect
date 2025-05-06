import * as Schema from "effect/Schema";

export class SwarmUnlockRequest extends Schema.Class<SwarmUnlockRequest>("SwarmUnlockRequest")(
    {
        /** UnlockKey is the unlock key in ASCII-armored format. */
        UnlockKey: Schema.String,
    },
    {
        identifier: "SwarmUnlockRequest",
        title: "swarm.UnlockRequest",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/swarm.go#L176-L180",
    }
) {}
