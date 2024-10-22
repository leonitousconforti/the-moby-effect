import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerConfig from "./ContainerConfig.generated.js";
import * as ContainerHostConfig from "./ContainerHostConfig.generated.js";
import * as ContainerNode from "./ContainerNode.generated.js";
import * as ContainerState from "./ContainerState.generated.js";
import * as GraphDriverData from "./GraphDriverData.generated.js";
import * as MountPoint from "./MountPoint.generated.js";
import * as NetworkSettings from "./NetworkSettings.generated.js";

export class ContainerInspectResponse extends Schema.Class<ContainerInspectResponse>("ContainerInspectResponse")(
    {
        Id: Schema.String,
        Created: Schema.String,
        Path: Schema.String,
        Args: Schema.NullOr(Schema.Array(Schema.String)),
        State: Schema.NullOr(ContainerState.ContainerState),
        Image: Schema.String,
        ResolvConfPath: Schema.String,
        HostnamePath: Schema.String,
        HostsPath: Schema.String,
        LogPath: Schema.String,
        Node: Schema.optionalWith(ContainerNode.ContainerNode, { nullable: true }),
        Name: Schema.String,
        RestartCount: MobySchemas.Int64,
        Driver: Schema.String,
        Platform: Schema.String,
        MountLabel: Schema.String,
        ProcessLabel: Schema.String,
        AppArmorProfile: Schema.String,
        ExecIDs: Schema.NullOr(Schema.Array(Schema.String)),
        HostConfig: Schema.NullOr(ContainerHostConfig.ContainerHostConfig),
        GraphDriver: Schema.NullOr(GraphDriverData.GraphDriverData),
        SizeRw: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
        SizeRootFs: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
        Mounts: Schema.NullOr(Schema.Array(Schema.NullOr(MountPoint.MountPoint))),
        Config: Schema.NullOr(ContainerConfig.ContainerConfig),
        NetworkSettings: Schema.NullOr(NetworkSettings.NetworkSettings),
    },
    {
        identifier: "ContainerInspectResponse",
        title: "types.ContainerJSON",
    }
) {}
