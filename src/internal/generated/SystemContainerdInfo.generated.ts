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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/system#ContainerdInfo",
    }
) {}
