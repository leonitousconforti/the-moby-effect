import * as Schema from "@effect/schema/Schema";

export class ServiceUpdateOptions extends Schema.Class<ServiceUpdateOptions>("ServiceUpdateOptions")(
    {
        EncodedRegistryAuth: Schema.NullOr(Schema.String),
        RegistryAuthFrom: Schema.NullOr(Schema.String),
        Rollback: Schema.NullOr(Schema.String),
        QueryRegistry: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "ServiceUpdateOptions",
        title: "types.ServiceUpdateOptions",
    }
) {}
