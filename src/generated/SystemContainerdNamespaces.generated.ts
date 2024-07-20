import * as Schema from "@effect/schema/Schema";

export class SystemContainerdNamespaces extends Schema.Class<SystemContainerdNamespaces>("SystemContainerdNamespaces")(
    {
        Containers: Schema.String,
        Plugins: Schema.String,
    },
    {
        identifier: "SystemContainerdNamespaces",
        title: "system.ContainerdNamespaces",
    }
) {}
