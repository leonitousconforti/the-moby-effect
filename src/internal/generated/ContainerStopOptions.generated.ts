import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerStopOptions extends Schema.Class<ContainerStopOptions>("ContainerStopOptions")(
    {
        Signal: Schema.optional(Schema.String),
        Timeout: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "ContainerStopOptions",
        title: "container.StopOptions",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#StopOptions",
    }
) {}
