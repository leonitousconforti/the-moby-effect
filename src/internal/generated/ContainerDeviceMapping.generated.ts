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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/hostconfig.go#L267-L272",
    }
) {}
