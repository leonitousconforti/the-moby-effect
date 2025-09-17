import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerUlimit extends Schema.Class<ContainerUlimit>("ContainerUlimit")(
    {
        Name: Schema.String,
        Hard: MobySchemas.Int64,
        Soft: MobySchemas.Int64,
    },
    {
        identifier: "ContainerUlimit",
        title: "units.Ulimit",
        documentation: "",
    }
) {}
