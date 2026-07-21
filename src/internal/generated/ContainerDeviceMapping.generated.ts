import * as Schema from "effect/Schema";

export class ContainerDeviceMapping extends Schema.Class<ContainerDeviceMapping>("ContainerDeviceMapping")(
    {
        PathOnHost: Schema.String,
        PathInContainer: Schema.String,
        CgroupPermissions: Schema.String,
    },
    {
        identifier: "ContainerDeviceMapping",
        title: "container.DeviceMapping",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#DeviceMapping",
    }
) {}
