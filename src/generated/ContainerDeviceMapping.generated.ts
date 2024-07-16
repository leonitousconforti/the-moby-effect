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
    }
) {}
