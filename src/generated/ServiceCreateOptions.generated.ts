import * as Schema from "@effect/schema/Schema";

export class ServiceCreateOptions extends Schema.Class<ServiceCreateOptions>("ServiceCreateOptions")(
    {
        EncodedRegistryAuth: Schema.NullOr(Schema.String),
        QueryRegistry: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "ServiceCreateOptions",
        title: "types.ServiceCreateOptions",
    }
) {}
