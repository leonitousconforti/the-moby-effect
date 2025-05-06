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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/secret.go#L5-L10",
    }
) {}
