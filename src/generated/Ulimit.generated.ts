import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class Ulimit extends Schema.Class<Ulimit>("Ulimit")(
    {
        Name: Schema.NullOr(Schema.String),
        Hard: Schema.NullOr(MobySchemas.Int64),
        Soft: Schema.NullOr(MobySchemas.Int64),
    },
    {
        identifier: "Ulimit",
        title: "units.Ulimit",
    }
) {}
