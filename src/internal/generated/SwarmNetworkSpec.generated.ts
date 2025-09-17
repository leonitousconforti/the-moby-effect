import * as Schema from "effect/Schema";
import * as NetworkConfigReference from "./NetworkConfigReference.generated.js";
import * as SwarmAnnotations from "./SwarmAnnotations.generated.js";
import * as SwarmDriver from "./SwarmDriver.generated.js";
import * as SwarmIPAMOptions from "./SwarmIPAMOptions.generated.js";

export class SwarmNetworkSpec extends Schema.Class<SwarmNetworkSpec>("SwarmNetworkSpec")(
    {
        ...SwarmAnnotations.SwarmAnnotations.fields,
        DriverConfiguration: Schema.optionalWith(SwarmDriver.SwarmDriver, { nullable: true }),
        IPv6Enabled: Schema.optional(Schema.Boolean),
        Internal: Schema.optional(Schema.Boolean),
        Attachable: Schema.optional(Schema.Boolean),
        Ingress: Schema.optional(Schema.Boolean),
        IPAMOptions: Schema.optionalWith(SwarmIPAMOptions.SwarmIPAMOptions, { nullable: true }),
        ConfigFrom: Schema.optionalWith(NetworkConfigReference.NetworkConfigReference, { nullable: true }),
        Scope: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmNetworkSpec",
        title: "swarm.NetworkSpec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#NetworkSpec",
    }
) {}
