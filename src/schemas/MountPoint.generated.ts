import * as Schema from "@effect/schema/Schema";

export class MountPoint extends Schema.Class<MountPoint>("MountPoint")({
    Type: Schema.String,
    Name: Schema.String,
    Source: Schema.String,
    Destination: Schema.String,
    Driver: Schema.String,
    Mode: Schema.String,
    RW: Schema.Boolean,
    Propagation: Schema.String,
}) {}
