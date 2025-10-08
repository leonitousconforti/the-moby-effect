import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";
import * as SwarmConfigSpec from "./SwarmConfigSpec.generated.js";
import * as SwarmMeta from "./SwarmMeta.generated.js";

export class SwarmConfig extends Schema.Class<SwarmConfig>("SwarmConfig")(
    {
        ID: MobyIdentifiers.ConfigIdentifier,
        ...SwarmMeta.SwarmMeta.fields,
        Spec: Schema.NullOr(SwarmConfigSpec.SwarmConfigSpec),
    },
    {
        identifier: "SwarmConfig",
        title: "swarm.Config",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Config",
    }
) {}
