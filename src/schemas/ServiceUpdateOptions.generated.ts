import * as Schema from "@effect/schema/Schema";

export class ServiceUpdateOptions extends Schema.Class<ServiceUpdateOptions>("ServiceUpdateOptions")({
    EncodedRegistryAuth: Schema.String,
    RegistryAuthFrom: Schema.String,
    Rollback: Schema.String,
    QueryRegistry: Schema.Boolean,
}) {}
