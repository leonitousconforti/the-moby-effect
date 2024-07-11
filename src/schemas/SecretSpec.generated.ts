import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class SecretSpec extends Schema.Class<SecretSpec>("SecretSpec")({
    Name: Schema.String,
    Labels: Schema.Record(Schema.String, Schema.String),
    Data: Schema.Array(MobySchemas.UInt8),
    Driver: MobySchemas.Driver,
    Templating: MobySchemas.Driver,
}) {}
