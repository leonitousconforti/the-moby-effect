import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class Network extends Schema.Class<Network>("Network")(
    {
        ID: Schema.NullOr(Schema.String),
        Version: Schema.optional(MobySchemasGenerated.Version),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time),
        Spec: Schema.optional(MobySchemasGenerated.NetworkSpec),
        DriverState: Schema.optional(MobySchemasGenerated.Driver),
        IPAMOptions: Schema.optional(MobySchemasGenerated.IPAMOptions, { nullable: true }),
    },
    {
        identifier: "Network",
        title: "swarm.Network",
    }
) {}
