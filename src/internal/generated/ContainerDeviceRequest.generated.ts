import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class ContainerDeviceRequest extends Schema.Class<ContainerDeviceRequest>("ContainerDeviceRequest")(
    {
        Driver: Schema.String,
        Count: EffectSchemas.Number.I64,
        DeviceIDs: Schema.NullOr(Schema.Array(Schema.String)),
        Capabilities: Schema.NullOr(Schema.Array(Schema.NullOr(Schema.Array(Schema.String)))),
        Options: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
    },
    {
        identifier: "ContainerDeviceRequest",
        title: "container.DeviceRequest",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#DeviceRequest",
    }
) {}
