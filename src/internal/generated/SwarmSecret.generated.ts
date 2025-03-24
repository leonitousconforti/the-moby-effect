import * as Schema from "effect/Schema";
import * as SwarmMeta from "./SwarmMeta.generated.js";
import * as SwarmSecretSpec from "./SwarmSecretSpec.generated.js";

export class SwarmSecret extends Schema.Class<SwarmSecret>("SwarmSecret")(
    {
        ID: Schema.String,
        ...SwarmMeta.SwarmMeta.fields,
        Spec: Schema.NullOr(SwarmSecretSpec.SwarmSecretSpec),
    },
    {
        identifier: "SwarmSecret",
        title: "swarm.Secret",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/secret.go#L5-L10",
    }
) {}
