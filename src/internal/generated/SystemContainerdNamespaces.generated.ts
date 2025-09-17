import * as Schema from "effect/Schema";

export class SystemContainerdNamespaces extends Schema.Class<SystemContainerdNamespaces>("SystemContainerdNamespaces")(
    {
        Containers: Schema.String,
        Plugins: Schema.String,
    },
    {
        identifier: "SystemContainerdNamespaces",
        title: "system.ContainerdNamespaces",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/system#ContainerdNamespaces",
    }
) {}
