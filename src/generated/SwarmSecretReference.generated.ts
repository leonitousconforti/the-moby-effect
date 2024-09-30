import * as Schema from "@effect/schema/Schema";
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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/secret.go#L31-L36",
    }
) {}
