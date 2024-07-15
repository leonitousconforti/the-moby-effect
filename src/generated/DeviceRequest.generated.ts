import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class DeviceRequest extends Schema.Class<DeviceRequest>("DeviceRequest")(
    {
        Driver: Schema.NullOr(Schema.String),
        Count: Schema.NullOr(MobySchemas.Int64),
        DeviceIDs: Schema.NullOr(Schema.Array(Schema.String)),
        Capabilities: Schema.NullOr(Schema.Array(Schema.Array(Schema.String))),
        Options: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
    },
    {
        identifier: "DeviceRequest",
        title: "container.DeviceRequest",
    }
) {}
