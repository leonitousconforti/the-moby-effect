import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmRestartPolicy extends Schema.Class<SwarmRestartPolicy>("SwarmRestartPolicy")(
    {
        Condition: Schema.optional(Schema.String),
        Delay: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
        MaxAttempts: Schema.optionalWith(MobySchemas.UInt64, { nullable: true }),
        Window: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "SwarmRestartPolicy",
        title: "swarm.RestartPolicy",
    }
) {}
