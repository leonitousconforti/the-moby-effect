import * as Schema from "effect/Schema";
import * as SwarmDriver from "./SwarmDriver.generated.js";

export class SwarmTaskDefaults extends Schema.Class<SwarmTaskDefaults>("SwarmTaskDefaults")(
    {
        LogDriver: Schema.optionalWith(SwarmDriver.SwarmDriver, { nullable: true }),
    },
    {
        identifier: "SwarmTaskDefaults",
        title: "swarm.TaskDefaults",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#TaskDefaults",
    }
) {}
