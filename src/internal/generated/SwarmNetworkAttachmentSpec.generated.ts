import * as Schema from "effect/Schema";

export class SwarmNetworkAttachmentSpec extends Schema.Class<SwarmNetworkAttachmentSpec>("SwarmNetworkAttachmentSpec")(
    {
        ContainerID: Schema.String,
    },
    {
        identifier: "SwarmNetworkAttachmentSpec",
        title: "swarm.NetworkAttachmentSpec",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#NetworkAttachmentSpec",
    }
) {}
