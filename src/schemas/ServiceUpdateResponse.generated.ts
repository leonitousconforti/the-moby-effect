import * as Schema from "@effect/schema/Schema";

export class ServiceUpdateResponse extends Schema.Class<ServiceUpdateResponse>("ServiceUpdateResponse")({
    Warnings: Schema.Array(Schema.String),
}) {}
