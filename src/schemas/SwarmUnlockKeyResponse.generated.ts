import * as Schema from "@effect/schema/Schema";

export class SwarmUnlockKeyResponse extends Schema.Class<SwarmUnlockKeyResponse>("SwarmUnlockKeyResponse")({
    UnlockKey: Schema.String,
}) {}
