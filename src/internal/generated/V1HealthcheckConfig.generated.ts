import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class V1HealthcheckConfig extends Schema.Class<V1HealthcheckConfig>("V1HealthcheckConfig")(
    {
        Test: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Interval: Schema.optional(EffectSchemas.Number.I64),
        Timeout: Schema.optional(EffectSchemas.Number.I64),
        StartPeriod: Schema.optional(EffectSchemas.Number.I64),
        StartInterval: Schema.optional(EffectSchemas.Number.I64),
        Retries: Schema.optional(EffectSchemas.Number.I64),
    },
    {
        identifier: "V1HealthcheckConfig",
        title: "v1.HealthcheckConfig",
        documentation: "",
    }
) {}
