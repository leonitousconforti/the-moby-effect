import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Container extends Schema.Class<Container>("Container")({
    ID: Schema.String,
    Names: Schema.Array(Schema.String),
    Image: Schema.String,
    ImageID: Schema.String,
    Command: Schema.String,
    Created: MobySchemas.Int64,
    Ports: Schema.Array(MobySchemas.Port),
    SizeRw: MobySchemas.Int64,
    SizeRootFs: MobySchemas.Int64,
    Labels: Schema.Record(Schema.String, Schema.String),
    State: Schema.String,
    Status: Schema.String,
    NetworkSettings: MobySchemas.SummaryNetworkSettings,
    Mounts: Schema.Array(MobySchemas.MountPoint),
}) {}
