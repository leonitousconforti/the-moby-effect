import * as Schema from "effect/Schema";
import * as SwarmSecretReferenceFileTarget from "./SwarmSecretReferenceFileTarget.generated.js";

export class SwarmSecretReference extends Schema.Class<SwarmSecretReference>("SwarmSecretReference")(
    {
        File: Schema.NullOr(SwarmSecretReferenceFileTarget.SwarmSecretReferenceFileTarget),
        SecretID: Schema.String,
        SecretName: Schema.String,
    },
    {
        identifier: "SwarmSecretReference",
        title: "swarm.SecretReference",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/secret.go#L45-L50",
    }
) {}
