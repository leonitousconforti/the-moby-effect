import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ContainerJSONBase extends Schema.Class<ContainerJSONBase>("ContainerJSONBase")({
    ID: Schema.String,
    Created: Schema.String,
    Path: Schema.String,
    Args: Schema.Array(Schema.String),
    State: MobySchemas.ContainerState,
    Image: Schema.String,
    ResolvConfPath: Schema.String,
    HostnamePath: Schema.String,
    HostsPath: Schema.String,
    LogPath: Schema.String,
    Node: MobySchemas.ContainerNode,
    Name: Schema.String,
    RestartCount: MobySchemas.Int64,
    Driver: Schema.String,
    Platform: Schema.String,
    MountLabel: Schema.String,
    ProcessLabel: Schema.String,
    AppArmorProfile: Schema.String,
    ExecIDs: Schema.Array(Schema.String),
    HostConfig: MobySchemas.HostConfig,
    GraphDriver: MobySchemas.GraphDriverData,
    SizeRw: MobySchemas.Int64,
    SizeRootFs: MobySchemas.Int64,
}) {}
