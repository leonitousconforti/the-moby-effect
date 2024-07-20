import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerHealthConfig extends Schema.Class<ContainerHealthConfig>("ContainerHealthConfig")(
    {
        Test: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Interval: Schema.optional(MobySchemas.Int64),
        Timeout: Schema.optional(MobySchemas.Int64),
        StartPeriod: Schema.optional(MobySchemas.Int64),
        StartInterval: Schema.optional(MobySchemas.Int64),
        Retries: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "ContainerHealthConfig",
        title: "v1.HealthcheckConfig",
    }
) {}
