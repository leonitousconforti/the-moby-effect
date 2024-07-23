import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmNode extends Schema.Class<SwarmNode>("SwarmNode")(
    {
        ID: Schema.String,
        Version: Schema.optional(MobySchemasGenerated.SwarmVersion, { nullable: true }),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time, { nullable: true }),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time, { nullable: true }),
        Spec: Schema.optional(MobySchemasGenerated.SwarmNodeSpec, { nullable: true }),
        Description: Schema.optional(MobySchemasGenerated.SwarmNodeDescription, { nullable: true }),
        Status: Schema.optional(MobySchemasGenerated.SwarmNodeStatus, { nullable: true }),
        ManagerStatus: Schema.optional(MobySchemasGenerated.SwarmManagerStatus, { nullable: true }),
    },
    {
        identifier: "SwarmNode",
        title: "swarm.Node",
    }
) {}
