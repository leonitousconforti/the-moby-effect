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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/system/info.go#L95-L122",
    }
) {}
