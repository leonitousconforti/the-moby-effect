import * as Schema from "@effect/schema/Schema";

export class UpdateFlags extends Schema.Class<UpdateFlags>("UpdateFlags")({
    RotateWorkerToken: Schema.Boolean,
    RotateManagerToken: Schema.Boolean,
    RotateManagerUnlockKey: Schema.Boolean,
}) {}
