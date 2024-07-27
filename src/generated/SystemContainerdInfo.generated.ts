import * as Schema from "@effect/schema/Schema";
import * as SystemContainerdNamespaces from "./SystemContainerdNamespaces.generated.js";

export class SystemContainerdInfo extends Schema.Class<SystemContainerdInfo>("SystemContainerdInfo")(
    {
        Address: Schema.optional(Schema.String),
        Namespaces: Schema.NullOr(SystemContainerdNamespaces.SystemContainerdNamespaces),
    },
    {
        identifier: "SystemContainerdInfo",
        title: "system.ContainerdInfo",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/system/info.go#L87-L93",
    }
) {}
