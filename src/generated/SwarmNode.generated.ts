import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmNode extends Schema.Class<SwarmNode>("SwarmNode")(
    {
        ID: Schema.String,
        Version: Schema.optional(MobySchemasGenerated.SwarmVersion),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time),
        Spec: Schema.optional(MobySchemasGenerated.SwarmNodeSpec),
        Description: Schema.optional(MobySchemasGenerated.SwarmNodeDescription),
        Status: Schema.optional(MobySchemasGenerated.SwarmNodeStatus),
        ManagerStatus: Schema.optional(MobySchemasGenerated.SwarmManagerStatus, { nullable: true }),
    },
    {
        identifier: "SwarmNode",
        title: "swarm.Node",
    }
) {}
