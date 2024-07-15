import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class Node extends Schema.Class<Node>("Node")(
    {
        ID: Schema.NullOr(Schema.String),
        Version: Schema.optional(MobySchemasGenerated.Version),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time),
        Spec: Schema.optional(MobySchemasGenerated.NodeSpec),
        Description: Schema.optional(MobySchemasGenerated.NodeDescription),
        Status: Schema.optional(MobySchemasGenerated.NodeStatus),
        ManagerStatus: Schema.optional(MobySchemasGenerated.ManagerStatus, { nullable: true }),
    },
    {
        identifier: "Node",
        title: "swarm.Node",
    }
) {}
