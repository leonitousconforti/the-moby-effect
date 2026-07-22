import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class SwarmSecretReferenceFileTarget extends Schema.Class<SwarmSecretReferenceFileTarget>(
    "SwarmSecretReferenceFileTarget"
)(
    {
        Name: Schema.String,
        UID: Schema.String,
        GID: Schema.String,
        Mode: MobyNumber.NumberFromWireString.check(
            Schema.isInt(),
            Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 })
        ),
    },
    {
        identifier: "SwarmSecretReferenceFileTarget",
        title: "swarm.SecretReferenceFileTarget",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#SecretReferenceFileTarget",
    }
) {}
