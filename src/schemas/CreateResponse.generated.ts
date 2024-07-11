import * as Schema from "@effect/schema/Schema";

export class CreateResponse extends Schema.Class<CreateResponse>("CreateResponse")({
    ID: Schema.String,
    Warnings: Schema.Array(Schema.String),
}) {}
