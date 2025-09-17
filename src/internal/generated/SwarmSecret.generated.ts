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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Secret",
    }
) {}
