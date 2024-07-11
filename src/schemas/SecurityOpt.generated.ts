import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class SecurityOpt extends Schema.Class<SecurityOpt>("SecurityOpt")({
    Name: Schema.String,
    Options: Schema.Array(MobySchemas.KeyValue),
}) {}
