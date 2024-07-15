import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class UpdateConfig extends Schema.Class<UpdateConfig>("UpdateConfig")(
    {
        Parallelism: Schema.NullOr(MobySchemas.UInt64),
        Delay: Schema.optional(MobySchemas.Int64, { nullable: true }),
        FailureAction: Schema.optional(Schema.String, { nullable: true }),
        Monitor: Schema.optional(MobySchemas.Int64, { nullable: true }),
        MaxFailureRatio: Schema.NullOr(Schema.Number),
        Order: Schema.NullOr(Schema.String),
    },
    {
        identifier: "UpdateConfig",
        title: "swarm.UpdateConfig",
    }
) {}
