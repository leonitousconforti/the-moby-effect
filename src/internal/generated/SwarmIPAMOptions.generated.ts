import * as Schema from "effect/Schema";
import * as SwarmDriver from "./SwarmDriver.generated.js";
import * as SwarmIPAMConfig from "./SwarmIPAMConfig.generated.js";

export class SwarmIPAMOptions extends Schema.Class<SwarmIPAMOptions>("SwarmIPAMOptions")(
    {
        Driver: Schema.optionalWith(SwarmDriver.SwarmDriver, { nullable: true }),
        Configs: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmIPAMConfig.SwarmIPAMConfig)), { nullable: true }),
    },
    {
        identifier: "SwarmIPAMOptions",
        title: "swarm.IPAMOptions",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/network.go#L110-L114",
    }
) {}
