import * as Schema from "@effect/schema/Schema";

export class SwarmNetworkAttachmentSpec extends Schema.Class<SwarmNetworkAttachmentSpec>("SwarmNetworkAttachmentSpec")(
    {
        ContainerID: Schema.String,
    },
    {
        identifier: "SwarmNetworkAttachmentSpec",
        title: "swarm.NetworkAttachmentSpec",
    }
) {}
