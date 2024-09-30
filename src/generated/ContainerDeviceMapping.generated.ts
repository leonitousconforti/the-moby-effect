import * as Schema from "@effect/schema/Schema";

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
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/hostconfig.go#L267-L272",
    }
) {}
