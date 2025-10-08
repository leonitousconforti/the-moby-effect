import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class UnitsUlimit extends Schema.Class<UnitsUlimit>("UnitsUlimit")(
    {
        Name: Schema.String,
        Hard: EffectSchemas.Number.I64,
        Soft: EffectSchemas.Number.I64,
    },
    {
        identifier: "UnitsUlimit",
        title: "units.Ulimit",
        documentation: "",
    }
) {}
