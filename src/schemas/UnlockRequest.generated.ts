import * as Schema from "@effect/schema/Schema";

export class UnlockRequest extends Schema.Class<UnlockRequest>("UnlockRequest")({
    UnlockKey: Schema.String,
}) {}
