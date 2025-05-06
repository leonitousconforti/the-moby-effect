import * as Schema from "effect/Schema";

export class SwarmUnlockKeyResponse extends Schema.Class<SwarmUnlockKeyResponse>("SwarmUnlockKeyResponse")(
    {
        /** UnlockKey is the unlock key in ASCII-armored format. */
        UnlockKey: Schema.String,
    },
    {
        identifier: "SwarmUnlockKeyResponse",
        title: "types.SwarmUnlockKeyResponse",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/client.go#L247-L252",
    }
) {}
