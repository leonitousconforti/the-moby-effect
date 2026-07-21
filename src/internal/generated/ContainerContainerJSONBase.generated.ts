import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";
import * as ContainerHostConfig from "./ContainerHostConfig.generated.ts";
import * as ContainerState from "./ContainerState.generated.ts";
import * as StorageDriverData from "./StorageDriverData.generated.ts";

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
        RestartCount: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        Driver: Schema.String,
        Platform: Schema.String,
        MountLabel: Schema.String,
        ProcessLabel: Schema.String,
        AppArmorProfile: Schema.String,
        ExecIDs: Schema.NullOr(Schema.Array(Schema.String)),
        HostConfig: Schema.NullOr(ContainerHostConfig.ContainerHostConfig),
        GraphDriver: Schema.NullOr(StorageDriverData.StorageDriverData),
        SizeRw: Schema.optional(Schema.NullOr(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })))),
        SizeRootFs: Schema.optional(Schema.NullOr(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })))),
    },
    {
        identifier: "ContainerContainerJSONBase",
        title: "container.ContainerJSONBase",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#ContainerJSONBase",
    }
) {}
