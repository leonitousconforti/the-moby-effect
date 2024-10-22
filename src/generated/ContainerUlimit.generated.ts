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
        documentation:
            "https://github.com/docker/go-units/blob/16e18b2861ca6fd622e7042ffeb9a3ebe8a9dff9/ulimit.go#L9-L14",
    }
) {}
