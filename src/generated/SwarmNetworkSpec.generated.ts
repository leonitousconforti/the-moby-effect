import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmNetworkSpec extends Schema.Class<SwarmNetworkSpec>("SwarmNetworkSpec")(
    {
        Name: Schema.optional(Schema.String),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        DriverConfiguration: Schema.optional(MobySchemasGenerated.SwarmDriver, { nullable: true }),
        IPv6Enabled: Schema.optional(Schema.Boolean),
        Internal: Schema.optional(Schema.Boolean),
        Attachable: Schema.optional(Schema.Boolean),
        Ingress: Schema.optional(Schema.Boolean),
        IPAMOptions: Schema.optional(MobySchemasGenerated.SwarmIPAMOptions, { nullable: true }),
        ConfigFrom: Schema.optional(MobySchemasGenerated.NetworkConfigReference, { nullable: true }),
        Scope: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmNetworkSpec",
        title: "swarm.NetworkSpec",
    }
) {}
