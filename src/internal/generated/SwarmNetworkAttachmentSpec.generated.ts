import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";

export class SwarmNetworkAttachmentSpec extends Schema.Class<SwarmNetworkAttachmentSpec>("SwarmNetworkAttachmentSpec")(
    {
        ContainerID: MobyIdentifiers.ContainerIdentifier,
    },
    {
        identifier: "SwarmNetworkAttachmentSpec",
        title: "swarm.NetworkAttachmentSpec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#NetworkAttachmentSpec",
    }
) {}
