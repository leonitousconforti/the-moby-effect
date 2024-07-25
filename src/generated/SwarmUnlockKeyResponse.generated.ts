import * as Schema from "@effect/schema/Schema";

export class SwarmUnlockKeyResponse extends Schema.Class<SwarmUnlockKeyResponse>("SwarmUnlockKeyResponse")(
    {
        UnlockKey: Schema.String,
    },
    {
        identifier: "SwarmUnlockKeyResponse",
        title: "types.SwarmUnlockKeyResponse",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/client.go#L247-L252",
    }
) {}
