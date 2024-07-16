import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class ContainerCreateConfig extends Schema.Class<ContainerCreateConfig>("ContainerCreateConfig")(
    {
        Name: Schema.String,
        Config: Schema.NullOr(MobySchemasGenerated.ContainerConfig),
        HostConfig: Schema.NullOr(MobySchemasGenerated.ContainerHostConfig),
        NetworkingConfig: Schema.NullOr(MobySchemasGenerated.NetworkingConfig),
        Platform: Schema.NullOr(MobySchemasGenerated.Platform),
        AdjustCPUShares: Schema.Boolean,
    },
    {
        identifier: "ContainerCreateConfig",
        title: "types.ContainerCreateConfig",
    }
) {}
