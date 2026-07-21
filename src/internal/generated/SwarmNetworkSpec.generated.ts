import * as Schema from "effect/Schema";

import * as NetworkConfigReference from "./NetworkConfigReference.generated.ts";
import * as SwarmAnnotations from "./SwarmAnnotations.generated.ts";
import * as SwarmDriver from "./SwarmDriver.generated.ts";
import * as SwarmIPAMOptions from "./SwarmIPAMOptions.generated.ts";

export class SwarmNetworkSpec extends Schema.Class<SwarmNetworkSpec>("SwarmNetworkSpec")(
    {
        ...SwarmAnnotations.SwarmAnnotations.fields,
        DriverConfiguration: Schema.optional(Schema.NullOr(SwarmDriver.SwarmDriver)),
        IPv6Enabled: Schema.optional(Schema.Boolean),
        Internal: Schema.optional(Schema.Boolean),
        Attachable: Schema.optional(Schema.Boolean),
        Ingress: Schema.optional(Schema.Boolean),
        IPAMOptions: Schema.optional(Schema.NullOr(SwarmIPAMOptions.SwarmIPAMOptions)),
        ConfigFrom: Schema.optional(Schema.NullOr(NetworkConfigReference.NetworkConfigReference)),
        Scope: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmNetworkSpec",
        title: "swarm.NetworkSpec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#NetworkSpec",
    }
) {}
