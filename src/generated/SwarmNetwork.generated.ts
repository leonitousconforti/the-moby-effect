import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmNetwork extends Schema.Class<SwarmNetwork>("SwarmNetwork")(
    {
        ID: Schema.String,
        Version: Schema.optionalWith(MobySchemasGenerated.SwarmVersion, { nullable: true }),
        CreatedAt: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
        UpdatedAt: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
        Spec: Schema.optionalWith(MobySchemasGenerated.SwarmNetworkSpec, { nullable: true }),
        DriverState: Schema.optionalWith(MobySchemasGenerated.SwarmDriver, { nullable: true }),
        IPAMOptions: Schema.optionalWith(MobySchemasGenerated.SwarmIPAMOptions, { nullable: true }),
    },
    {
        identifier: "SwarmNetwork",
        title: "swarm.Network",
    }
) {}
