import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SystemContainerdInfo extends Schema.Class<SystemContainerdInfo>("SystemContainerdInfo")(
    {
        Address: Schema.optional(Schema.String),
        Namespaces: Schema.NullOr(MobySchemasGenerated.SystemContainerdNamespaces),
    },
    {
        identifier: "SystemContainerdInfo",
        title: "system.ContainerdInfo",
    }
) {}
