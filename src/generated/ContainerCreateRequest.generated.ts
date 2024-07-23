import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class ContainerCreateRequest extends Schema.Class<ContainerCreateRequest>("ContainerCreateRequest")(
    {
        ...MobySchemasGenerated.ContainerConfig.fields,
        HostConfig: Schema.optional(MobySchemasGenerated.ContainerHostConfig, { nullable: true }),
        NetworkingConfig: Schema.optional(MobySchemasGenerated.NetworkNetworkingConfig, { nullable: true }),
    },
    {
        identifier: "ContainerCreateRequest",
        title: "container.CreateRequest",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/create_request.go#L5-L13",
    }
) {}
