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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/system/info.go#L96-L123",
    }
) {}
