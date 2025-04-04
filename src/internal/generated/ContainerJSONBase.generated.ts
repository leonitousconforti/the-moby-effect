import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerHostConfig from "./ContainerHostConfig.generated.js";
import * as ContainerNode from "./ContainerNode.generated.js";
import * as ContainerState from "./ContainerState.generated.js";
import * as GraphDriverData from "./GraphDriverData.generated.js";

export class ContainerJSONBase extends Schema.Class<ContainerJSONBase>("ContainerJSONBase")(
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
    },
    {
        identifier: "ContainerJSONBase",
        title: "types.ContainerJSONBase",
    }
) {}
