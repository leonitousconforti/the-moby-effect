import * as Schema from "effect/Schema";

export class SwarmNetworkAttachmentSpec extends Schema.Class<SwarmNetworkAttachmentSpec>("SwarmNetworkAttachmentSpec")(
    {
        ContainerID: Schema.String,
    },
    {
        identifier: "SwarmNetworkAttachmentSpec",
        title: "swarm.NetworkAttachmentSpec",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/runtime.go#L23-L27",
    }
) {}
