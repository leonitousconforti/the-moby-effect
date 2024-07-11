import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Node extends Schema.Class<Node>("Node")({
    ID: Schema.String,
    Version: MobySchemas.Version,
    CreatedAt: MobySchemas.Time,
    UpdatedAt: MobySchemas.Time,
    Spec: MobySchemas.NodeSpec,
    Description: MobySchemas.NodeDescription,
    Status: MobySchemas.NodeStatus,
    ManagerStatus: MobySchemas.ManagerStatus,
}) {}
