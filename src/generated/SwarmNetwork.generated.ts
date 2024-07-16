import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmNetwork extends Schema.Class<SwarmNetwork>("SwarmNetwork")(
    {
        ID: Schema.String,
        Version: Schema.optional(MobySchemasGenerated.SwarmVersion),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time),
        Spec: Schema.optional(MobySchemasGenerated.SwarmNetworkSpec),
        DriverState: Schema.optional(MobySchemasGenerated.SwarmDriver),
        IPAMOptions: Schema.optional(MobySchemasGenerated.SwarmIPAMOptions, { nullable: true }),
    },
    {
        identifier: "SwarmNetwork",
        title: "swarm.Network",
    }
) {}
