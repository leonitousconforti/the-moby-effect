import * as Schema from "effect/Schema";
import * as SwarmDriver from "./SwarmDriver.generated.js";
import * as SwarmIPAMOptions from "./SwarmIPAMOptions.generated.js";
import * as SwarmMeta from "./SwarmMeta.generated.js";
import * as SwarmNetworkSpec from "./SwarmNetworkSpec.generated.js";

export class SwarmNetwork extends Schema.Class<SwarmNetwork>("SwarmNetwork")(
    {
        ID: Schema.String,
        ...SwarmMeta.SwarmMeta.fields,
        Spec: Schema.optionalWith(SwarmNetworkSpec.SwarmNetworkSpec, { nullable: true }),
        DriverState: Schema.optionalWith(SwarmDriver.SwarmDriver, { nullable: true }),
        IPAMOptions: Schema.optionalWith(SwarmIPAMOptions.SwarmIPAMOptions, { nullable: true }),
    },
    {
        identifier: "SwarmNetwork",
        title: "swarm.Network",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/network.go#L75-L82",
    }
) {}
