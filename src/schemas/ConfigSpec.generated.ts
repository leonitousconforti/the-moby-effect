import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ConfigSpec extends Schema.Class<ConfigSpec>("ConfigSpec")({
    Name: Schema.String,
    Labels: Schema.Record(Schema.String, Schema.String),
    Data: Schema.Array(MobySchemas.UInt8),
    Templating: MobySchemas.Driver,
}) {}
