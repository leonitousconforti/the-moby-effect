import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NetworkListOptions extends Schema.Class<NetworkListOptions>("NetworkListOptions")(
    {
        Filters: MobySchemasGenerated.Args,
    },
    {
        identifier: "NetworkListOptions",
        title: "types.NetworkListOptions",
    }
) {}
