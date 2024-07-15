import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class ConfigListOptions extends Schema.Class<ConfigListOptions>("ConfigListOptions")(
    {
        Filters: MobySchemasGenerated.Args,
    },
    {
        identifier: "ConfigListOptions",
        title: "types.ConfigListOptions",
    }
) {}
