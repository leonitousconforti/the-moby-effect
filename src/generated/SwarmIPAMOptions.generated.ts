import * as Schema from "@effect/schema/Schema";
import * as SwarmDriver from "./SwarmDriver.generated.js";
import * as SwarmIPAMConfig from "./SwarmIPAMConfig.generated.js";

export class SwarmIPAMOptions extends Schema.Class<SwarmIPAMOptions>("SwarmIPAMOptions")(
    {
        Driver: Schema.optionalWith(SwarmDriver.SwarmDriver, { nullable: true }),
        Configs: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmIPAMConfig.SwarmIPAMConfig)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmIPAMOptions",
        title: "swarm.IPAMOptions",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/network.go#L110-L114",
    }
) {}
