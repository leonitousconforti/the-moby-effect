import * as Schema from "@effect/schema/Schema";

export class UpdateFlags extends Schema.Class<UpdateFlags>("UpdateFlags")(
    {
        RotateWorkerToken: Schema.NullOr(Schema.Boolean),
        RotateManagerToken: Schema.NullOr(Schema.Boolean),
        RotateManagerUnlockKey: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "UpdateFlags",
        title: "swarm.UpdateFlags",
    }
) {}
