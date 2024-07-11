import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class DeviceRequest extends Schema.Class<DeviceRequest>("DeviceRequest")({
    Driver: Schema.String,
    Count: MobySchemas.Int64,
    DeviceIDs: Schema.Array(Schema.String),
    Capabilities: Schema.Array(Schema.Array(Schema.String)),
    Options: Schema.Record(Schema.String, Schema.String),
}) {}
