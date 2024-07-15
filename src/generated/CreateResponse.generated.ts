import * as Schema from "@effect/schema/Schema";

export class CreateResponse extends Schema.Class<CreateResponse>("CreateResponse")(
    {
        Id: Schema.NullOr(Schema.String),
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "CreateResponse",
        title: "container.CreateResponse",
    }
) {}
