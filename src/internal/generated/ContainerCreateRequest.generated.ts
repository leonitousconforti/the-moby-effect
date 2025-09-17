import * as Schema from "effect/Schema";
import * as ContainerConfig from "./ContainerConfig.generated.js";
import * as ContainerHostConfig from "./ContainerHostConfig.generated.js";
import * as NetworkNetworkingConfig from "./NetworkNetworkingConfig.generated.js";

export class ContainerCreateRequest extends Schema.Class<ContainerCreateRequest>("ContainerCreateRequest")(
    {
        ...ContainerConfig.ContainerConfig.fields,
        HostConfig: Schema.optionalWith(ContainerHostConfig.ContainerHostConfig, { nullable: true }),
        NetworkingConfig: Schema.optionalWith(NetworkNetworkingConfig.NetworkNetworkingConfig, { nullable: true }),
    },
    {
        identifier: "ContainerCreateRequest",
        title: "container.CreateRequest",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#CreateRequest",
    }
) {}
