import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Address extends Schema.Class<Address>("Address")({
    Addr: Schema.String,
    PrefixLen: MobySchemas.Int64,
}) {}
