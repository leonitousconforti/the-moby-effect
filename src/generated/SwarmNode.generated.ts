import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmNode extends Schema.Class<SwarmNode>("SwarmNode")(
    {
        ID: Schema.String,
        Version: Schema.optionalWith(MobySchemasGenerated.SwarmVersion, { nullable: true }),
        CreatedAt: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
        UpdatedAt: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
        Spec: Schema.optionalWith(MobySchemasGenerated.SwarmNodeSpec, { nullable: true }),
        Description: Schema.optionalWith(MobySchemasGenerated.SwarmNodeDescription, { nullable: true }),
        Status: Schema.optionalWith(MobySchemasGenerated.SwarmNodeStatus, { nullable: true }),
        ManagerStatus: Schema.optionalWith(MobySchemasGenerated.SwarmManagerStatus, { nullable: true }),
    },
    {
        identifier: "SwarmNode",
        title: "swarm.Node",
    }
) {}
