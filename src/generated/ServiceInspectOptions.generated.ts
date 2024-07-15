import * as Schema from "@effect/schema/Schema";

export class ServiceInspectOptions extends Schema.Class<ServiceInspectOptions>("ServiceInspectOptions")(
    {
        InsertDefaults: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "ServiceInspectOptions",
        title: "types.ServiceInspectOptions",
    }
) {}
