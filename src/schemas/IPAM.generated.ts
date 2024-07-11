import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class IPAM extends Schema.Class<IPAM>("IPAM")({
    Driver: Schema.String,
    Options: Schema.Record(Schema.String, Schema.String),
    Config: Schema.Array(MobySchemas.IPAMConfig),
}) {}
