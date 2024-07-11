import * as Schema from "@effect/schema/Schema";

export class ContainerUpdateOKBody extends Schema.Class<ContainerUpdateOKBody>("ContainerUpdateOKBody")({
    Warnings: Schema.Array(Schema.String),
}) {}
