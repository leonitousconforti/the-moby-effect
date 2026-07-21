import * as Schema from "effect/Schema";

import * as ContainerConfig from "./ContainerConfig.generated.ts";
import * as ContainerHostConfig from "./ContainerHostConfig.generated.ts";
import * as NetworkNetworkingConfig from "./NetworkNetworkingConfig.generated.ts";

export class ContainerCreateRequest extends Schema.Class<ContainerCreateRequest>("ContainerCreateRequest")(
    {
        ...ContainerConfig.ContainerConfig.fields,
        HostConfig: Schema.optional(Schema.NullOr(ContainerHostConfig.ContainerHostConfig)),
        NetworkingConfig: Schema.optional(Schema.NullOr(NetworkNetworkingConfig.NetworkNetworkingConfig)),
    },
    {
        identifier: "ContainerCreateRequest",
        title: "container.CreateRequest",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#CreateRequest",
    }
) {}
