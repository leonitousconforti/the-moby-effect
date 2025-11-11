import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";
import * as ContainerHostConfig from "./ContainerHostConfig.generated.js";
import * as ContainerState from "./ContainerState.generated.js";
import * as StorageDriverData from "./StorageDriverData.generated.js";

export class ContainerContainerJSONBase extends Schema.Class<ContainerContainerJSONBase>("ContainerContainerJSONBase")(
    {
        Id: MobyIdentifiers.ContainerIdentifier,
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
        RestartCount: EffectSchemas.Number.I64,
        Driver: Schema.String,
        Platform: Schema.String,
        MountLabel: Schema.String,
        ProcessLabel: Schema.String,
        AppArmorProfile: Schema.String,
        ExecIDs: Schema.NullOr(Schema.Array(Schema.String)),
        HostConfig: Schema.NullOr(ContainerHostConfig.ContainerHostConfig),
        GraphDriver: Schema.NullishOr(StorageDriverData.StorageDriverData), // optional for docker.io/library/docker:26-dind-rootless
        SizeRw: Schema.optionalWith(EffectSchemas.Number.I64, { nullable: true }),
        SizeRootFs: Schema.optionalWith(EffectSchemas.Number.I64, { nullable: true }),
    },
    {
        identifier: "ContainerContainerJSONBase",
        title: "container.ContainerJSONBase",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#ContainerJSONBase",
    }
) {}
