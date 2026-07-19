import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";
import * as SwarmDriver from "./SwarmDriver.generated.ts";
import * as SwarmIPAMOptions from "./SwarmIPAMOptions.generated.ts";
import * as SwarmMeta from "./SwarmMeta.generated.ts";
import * as SwarmNetworkSpec from "./SwarmNetworkSpec.generated.ts";

export class SwarmNetwork extends Schema.Class<SwarmNetwork>("SwarmNetwork")(
    {
        ID: MobyIdentifiers.NetworkIdentifier,
        ...SwarmMeta.SwarmMeta.fields,
        Spec: Schema.optional(Schema.NullOr(SwarmNetworkSpec.SwarmNetworkSpec)),
        DriverState: Schema.optional(Schema.NullOr(SwarmDriver.SwarmDriver)),
        IPAMOptions: Schema.optional(Schema.NullOr(SwarmIPAMOptions.SwarmIPAMOptions)),
    },
    {
        identifier: "SwarmNetwork",
        title: "swarm.Network",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Network",
    }
) {}
