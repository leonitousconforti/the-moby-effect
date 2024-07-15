import * as Schema from "@effect/schema/Schema";

export class NodeRemoveOptions extends Schema.Class<NodeRemoveOptions>("NodeRemoveOptions")(
    {
        Force: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "NodeRemoveOptions",
        title: "types.NodeRemoveOptions",
    }
) {}
