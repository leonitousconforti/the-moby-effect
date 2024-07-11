import * as Schema from "@effect/schema/Schema";

export class DeviceMapping extends Schema.Class<DeviceMapping>("DeviceMapping")({
    PathOnHost: Schema.String,
    PathInContainer: Schema.String,
    CgroupPermissions: Schema.String,
}) {}
