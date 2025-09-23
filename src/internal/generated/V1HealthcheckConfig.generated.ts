import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class V1HealthcheckConfig extends Schema.Class<V1HealthcheckConfig>("V1HealthcheckConfig")(
    {
        Test: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Interval: Schema.optional(MobySchemas.Int64),
        Timeout: Schema.optional(MobySchemas.Int64),
        StartPeriod: Schema.optional(MobySchemas.Int64),
        StartInterval: Schema.optional(MobySchemas.Int64),
        Retries: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "V1HealthcheckConfig",
        title: "v1.HealthcheckConfig",
        documentation: "",
    }
) {}
