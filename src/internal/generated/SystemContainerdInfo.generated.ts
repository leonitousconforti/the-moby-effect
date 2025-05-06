import * as Schema from "effect/Schema";
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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/system/info.go#L87-L93",
    }
) {}
