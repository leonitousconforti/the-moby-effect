import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmNetwork extends Schema.Class<SwarmNetwork>("SwarmNetwork")(
    {
        ID: Schema.String,
        Version: Schema.optional(MobySchemasGenerated.SwarmVersion, { nullable: true }),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time, { nullable: true }),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time, { nullable: true }),
        Spec: Schema.optional(MobySchemasGenerated.SwarmNetworkSpec, { nullable: true }),
        DriverState: Schema.optional(MobySchemasGenerated.SwarmDriver, { nullable: true }),
        IPAMOptions: Schema.optional(MobySchemasGenerated.SwarmIPAMOptions, { nullable: true }),
    },
    {
        identifier: "SwarmNetwork",
        title: "swarm.Network",
    }
) {}
