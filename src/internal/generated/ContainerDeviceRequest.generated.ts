import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerDeviceRequest extends Schema.Class<ContainerDeviceRequest>("ContainerDeviceRequest")(
    {
        /** Name of device driver */
        Driver: Schema.String,

        /** Number of devices to request (-1 = All) */
        Count: MobySchemas.Int64,

        /** List of device IDs as recognizable by the device driver */
        DeviceIDs: Schema.NullOr(Schema.Array(Schema.String)),

        /** An OR list of AND lists of device capabilities (e.g. "gpu") */
        Capabilities: Schema.NullOr(Schema.Array(Schema.NullOr(Schema.Array(Schema.String)))),

        /** Options to pass onto the device driver */
        Options: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
    },
    {
        identifier: "ContainerDeviceRequest",
        title: "container.DeviceRequest",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/hostconfig.go#L257-L265",
    }
) {}
