import * as Schema from "@effect/schema/Schema";
import * as SwarmDriver from "./SwarmDriver.generated.js";
import * as SwarmIPAMOptions from "./SwarmIPAMOptions.generated.js";
import * as SwarmNetworkSpec from "./SwarmNetworkSpec.generated.js";
import * as SwarmVersion from "./SwarmVersion.generated.js";

export class SwarmNetwork extends Schema.Class<SwarmNetwork>("SwarmNetwork")(
    {
        ID: Schema.String,
        Version: Schema.optionalWith(SwarmVersion.SwarmVersion, { nullable: true }),
        CreatedAt: Schema.optionalWith(Schema.DateFromString, { nullable: true }),
        UpdatedAt: Schema.optionalWith(Schema.DateFromString, { nullable: true }),
        Spec: Schema.optionalWith(SwarmNetworkSpec.SwarmNetworkSpec, { nullable: true }),
        DriverState: Schema.optionalWith(SwarmDriver.SwarmDriver, { nullable: true }),
        IPAMOptions: Schema.optionalWith(SwarmIPAMOptions.SwarmIPAMOptions, { nullable: true }),
    },
    {
        identifier: "SwarmNetwork",
        title: "swarm.Network",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/network.go#L75-L82",
    }
) {}
