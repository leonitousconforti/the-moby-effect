import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class HealthConfig extends Schema.Class<HealthConfig>("HealthConfig")(
    {
        Test: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Interval: Schema.optional(MobySchemas.Int64, { nullable: true }),
        Timeout: Schema.optional(MobySchemas.Int64, { nullable: true }),
        StartPeriod: Schema.optional(MobySchemas.Int64, { nullable: true }),
        Retries: Schema.optional(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "HealthConfig",
        title: "container.HealthConfig",
    }
) {}
