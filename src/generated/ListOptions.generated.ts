import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class ListOptions extends Schema.Class<ListOptions>("ListOptions")(
    {
        Filters: MobySchemasGenerated.Args,
    },
    {
        identifier: "ListOptions",
        title: "volume.ListOptions",
    }
) {}
