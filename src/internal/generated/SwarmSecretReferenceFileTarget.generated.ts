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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/secret.go#L37-L43",
    }
) {}
