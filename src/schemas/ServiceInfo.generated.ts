import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ServiceInfo extends Schema.Class<ServiceInfo>("ServiceInfo")({
    VIP: Schema.String,
    Ports: Schema.Array(Schema.String),
    LocalLBIndex: MobySchemas.Int64,
    Tasks: Schema.Array(MobySchemas.Task),
}) {}
