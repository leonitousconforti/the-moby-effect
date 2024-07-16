import * as Schema from "@effect/schema/Schema";

export class ContainerCreateResponse extends Schema.Class<ContainerCreateResponse>("ContainerCreateResponse")(
    {
        Id: Schema.String,
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ContainerCreateResponse",
        title: "container.CreateResponse",
    }
) {}
