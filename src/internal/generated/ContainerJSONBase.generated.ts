import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerHostConfig from "./ContainerHostConfig.generated.js";
import * as DriverData from "./DriverData.generated.js";
import * as State from "./State.generated.js";

export class ContainerJSONBase extends Schema.Class<ContainerJSONBase>("ContainerJSONBase")(
    {
        Id: Schema.String,
        Created: Schema.String,
        Path: Schema.String,
        Args: Schema.NullOr(Schema.Array(Schema.String)),
        State: Schema.NullOr(State.State),
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
        GraphDriver: Schema.NullOr(DriverData.DriverData),
        SizeRw: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
        SizeRootFs: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "ContainerJSONBase",
        title: "container.ContainerJSONBase",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#ContainerJSONBase",
    }
) {}
