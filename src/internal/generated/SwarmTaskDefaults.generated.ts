import * as Schema from "effect/Schema";
import * as SwarmDriver from "./SwarmDriver.generated.ts";

export class SwarmTaskDefaults extends Schema.Class<SwarmTaskDefaults>("SwarmTaskDefaults")(
    {
        LogDriver: Schema.optional(Schema.NullOr(SwarmDriver.SwarmDriver)),
    },
    {
        identifier: "SwarmTaskDefaults",
        title: "swarm.TaskDefaults",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#TaskDefaults",
    }
) {}
