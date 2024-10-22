import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmSecretReferenceFileTarget extends Schema.Class<SwarmSecretReferenceFileTarget>(
    "SwarmSecretReferenceFileTarget"
)(
    {
        Name: Schema.String,
        UID: Schema.String,
        GID: Schema.String,
        Mode: MobySchemas.UInt32,
    },
    {
        identifier: "SwarmSecretReferenceFileTarget",
        title: "swarm.SecretReferenceFileTarget",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/secret.go#L23-L29",
    }
) {}
