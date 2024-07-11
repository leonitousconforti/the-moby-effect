import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Port extends Schema.Class<Port>("Port")({
    IP: Schema.String,
    PrivatePort: MobySchemas.UInt16,
    PublicPort: MobySchemas.UInt16,
    Type: Schema.String,
}) {}
