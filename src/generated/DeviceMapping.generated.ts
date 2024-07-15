import * as Schema from "@effect/schema/Schema";

export class DeviceMapping extends Schema.Class<DeviceMapping>("DeviceMapping")(
    {
        PathOnHost: Schema.NullOr(Schema.String),
        PathInContainer: Schema.NullOr(Schema.String),
        CgroupPermissions: Schema.NullOr(Schema.String),
    },
    {
        identifier: "DeviceMapping",
        title: "container.DeviceMapping",
    }
) {}
