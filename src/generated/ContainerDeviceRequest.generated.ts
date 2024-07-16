import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerDeviceRequest extends Schema.Class<ContainerDeviceRequest>("ContainerDeviceRequest")(
    {
        Driver: Schema.String,
        Count: MobySchemas.Int64,
        DeviceIDs: Schema.NullOr(Schema.Array(Schema.String)),
        Capabilities: Schema.NullOr(Schema.Array(Schema.Array(Schema.String))),
        Options: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
    },
    {
        identifier: "ContainerDeviceRequest",
        title: "container.DeviceRequest",
    }
) {}
