import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class ServiceListOptions extends Schema.Class<ServiceListOptions>("ServiceListOptions")(
    {
        Filters: MobySchemasGenerated.Args,
        Status: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "ServiceListOptions",
        title: "types.ServiceListOptions",
    }
) {}
