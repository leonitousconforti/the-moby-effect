import * as Schema from "effect/Schema";

export class SwarmNetworkAttachmentSpec extends Schema.Class<SwarmNetworkAttachmentSpec>("SwarmNetworkAttachmentSpec")(
    {
        ContainerID: Schema.String,
    },
    {
        identifier: "SwarmNetworkAttachmentSpec",
        title: "swarm.NetworkAttachmentSpec",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/runtime.go#L23-L27",
    }
) {}
