import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ContainerNode extends Schema.Class<ContainerNode>("ContainerNode")({
    ID: Schema.String,
    IPAddress: Schema.String,
    Addr: Schema.String,
    Name: Schema.String,
    Cpus: MobySchemas.Int64,
    Memory: MobySchemas.Int64,
    Labels: Schema.Record(Schema.String, Schema.String),
}) {}
