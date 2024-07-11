import * as Schema from "@effect/schema/Schema";

export class ServiceCreateOptions extends Schema.Class<ServiceCreateOptions>("ServiceCreateOptions")({
    EncodedRegistryAuth: Schema.String,
    QueryRegistry: Schema.Boolean,
}) {}
