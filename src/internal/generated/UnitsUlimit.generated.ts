import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class UnitsUlimit extends Schema.Class<UnitsUlimit>("UnitsUlimit")(
    {
        Name: Schema.String,
        Hard: MobySchemas.Int64,
        Soft: MobySchemas.Int64,
    },
    {
        identifier: "UnitsUlimit",
        title: "units.Ulimit",
        documentation: "",
    }
) {}
