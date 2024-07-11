import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class zone extends Schema.Class<zone>("zone")({
    name: Schema.String,
    offset: MobySchemas.Int64,
    isDST: Schema.Boolean,
}) {}
