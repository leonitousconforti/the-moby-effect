import * as Schema from "@effect/schema/Schema";

export class NodeStatus extends Schema.Class<NodeStatus>("NodeStatus")({
    State: Schema.String,
    Message: Schema.String,
    Addr: Schema.String,
}) {}
