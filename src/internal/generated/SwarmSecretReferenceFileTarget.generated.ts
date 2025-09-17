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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#SecretReferenceFileTarget",
    }
) {}
