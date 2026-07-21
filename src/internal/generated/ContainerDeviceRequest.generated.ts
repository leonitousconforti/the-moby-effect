import * as Schema from "effect/Schema";

export class ContainerDeviceRequest extends Schema.Class<ContainerDeviceRequest>("ContainerDeviceRequest")(
    {
        Driver: Schema.String,
        Count: Schema.BigIntFromString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
        DeviceIDs: Schema.NullOr(Schema.Array(Schema.String)),
        Capabilities: Schema.NullOr(Schema.Array(Schema.NullOr(Schema.Array(Schema.String)))),
        Options: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
    },
    {
        identifier: "ContainerDeviceRequest",
        title: "container.DeviceRequest",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#DeviceRequest",
    }
) {}
