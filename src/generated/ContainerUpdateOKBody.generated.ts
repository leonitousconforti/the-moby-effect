import * as Schema from "@effect/schema/Schema";

export class ContainerUpdateOKBody extends Schema.Class<ContainerUpdateOKBody>("ContainerUpdateOKBody")(
    {
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ContainerUpdateOKBody",
        title: "container.ContainerUpdateOKBody",
    }
) {}
