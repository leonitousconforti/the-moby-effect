import * as Schema from "@effect/schema/Schema";

export class NodeRemoveOptions extends Schema.Class<NodeRemoveOptions>("NodeRemoveOptions")({
    Force: Schema.Boolean,
}) {}
