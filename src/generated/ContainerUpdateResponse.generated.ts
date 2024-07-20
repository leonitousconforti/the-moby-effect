import * as Schema from "@effect/schema/Schema";

export class ContainerUpdateResponse extends Schema.Class<ContainerUpdateResponse>("ContainerUpdateResponse")(
    {
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ContainerUpdateResponse",
        title: "container.ContainerUpdateOKBody",
    }
) {}
