import * as Schema from "@effect/schema/Schema";
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
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/create_request.go#L5-L13",
    }
) {}
