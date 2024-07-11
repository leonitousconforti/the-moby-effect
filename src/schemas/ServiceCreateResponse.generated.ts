import * as Schema from "@effect/schema/Schema";

export class ServiceCreateResponse extends Schema.Class<ServiceCreateResponse>("ServiceCreateResponse")({
    ID: Schema.String,
    Warnings: Schema.Array(Schema.String),
}) {}
