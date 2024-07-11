import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Ulimit extends Schema.Class<Ulimit>("Ulimit")({
    Name: Schema.String,
    Hard: MobySchemas.Int64,
    Soft: MobySchemas.Int64,
}) {}
