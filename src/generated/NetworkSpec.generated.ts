import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NetworkSpec extends Schema.Class<NetworkSpec>("NetworkSpec")(
    {
        Name: Schema.optional(Schema.String, { nullable: true }),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        DriverConfiguration: Schema.optional(MobySchemasGenerated.Driver, { nullable: true }),
        IPv6Enabled: Schema.optional(Schema.Boolean, { nullable: true }),
        Internal: Schema.optional(Schema.Boolean, { nullable: true }),
        Attachable: Schema.optional(Schema.Boolean, { nullable: true }),
        Ingress: Schema.optional(Schema.Boolean, { nullable: true }),
        IPAMOptions: Schema.optional(MobySchemasGenerated.IPAMOptions, { nullable: true }),
        ConfigFrom: Schema.optional(MobySchemasGenerated.ConfigReference, { nullable: true }),
        Scope: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "NetworkSpec",
        title: "swarm.NetworkSpec",
    }
) {}
