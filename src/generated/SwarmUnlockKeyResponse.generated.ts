import * as Schema from "@effect/schema/Schema";

export class SwarmUnlockKeyResponse extends Schema.Class<SwarmUnlockKeyResponse>("SwarmUnlockKeyResponse")(
    {
        UnlockKey: Schema.NullOr(Schema.String),
    },
    {
        identifier: "SwarmUnlockKeyResponse",
        title: "types.SwarmUnlockKeyResponse",
    }
) {}
