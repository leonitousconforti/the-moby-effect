import * as Schema from "effect/Schema";

import * as MobyIdentifiers from "../schemas/id.ts";
import * as SwarmMeta from "./SwarmMeta.generated.ts";
import * as SwarmSecretSpec from "./SwarmSecretSpec.generated.ts";

export class SwarmSecret extends Schema.Class<SwarmSecret>("SwarmSecret")(
    {
        ID: MobyIdentifiers.SecretIdentifier,
        ...SwarmMeta.SwarmMeta.fields,
        Spec: Schema.NullOr(SwarmSecretSpec.SwarmSecretSpec),
    },
    {
        identifier: "SwarmSecret",
        title: "swarm.Secret",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Secret",
    }
) {}
