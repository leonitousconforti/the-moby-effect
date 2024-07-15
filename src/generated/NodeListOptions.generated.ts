import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NodeListOptions extends Schema.Class<NodeListOptions>("NodeListOptions")(
    {
        Filters: MobySchemasGenerated.Args,
    },
    {
        identifier: "NodeListOptions",
        title: "types.NodeListOptions",
    }
) {}
