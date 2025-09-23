import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerHostConfig from "./ContainerHostConfig.generated.js";
import * as ContainerState from "./ContainerState.generated.js";
import * as StorageDriverData from "./StorageDriverData.generated.js";

export class ContainerContainerJSONBase extends Schema.Class<ContainerContainerJSONBase>("ContainerContainerJSONBase")(
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
        Name: Schema.String,
        RestartCount: MobySchemas.Int64,
        Driver: Schema.String,
        Platform: Schema.String,
        MountLabel: Schema.String,
        ProcessLabel: Schema.String,
        AppArmorProfile: Schema.String,
        ExecIDs: Schema.NullOr(Schema.Array(Schema.String)),
        HostConfig: Schema.NullOr(ContainerHostConfig.ContainerHostConfig),
        GraphDriver: Schema.NullOr(StorageDriverData.StorageDriverData),
        SizeRw: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
        SizeRootFs: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "ContainerContainerJSONBase",
        title: "container.ContainerJSONBase",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#ContainerJSONBase",
    }
) {}
