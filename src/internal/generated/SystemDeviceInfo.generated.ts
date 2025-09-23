import * as Schema from "effect/Schema";

export class SystemDeviceInfo extends Schema.Class<SystemDeviceInfo>("SystemDeviceInfo")(
    {
        Source: Schema.String,
        ID: Schema.String,
    },
    {
        identifier: "SystemDeviceInfo",
        title: "system.DeviceInfo",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/system#DeviceInfo",
    }
) {}
