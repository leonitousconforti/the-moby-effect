import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerStopOptions extends Schema.Class<ContainerStopOptions>("ContainerStopOptions")(
    {
        Signal: Schema.optional(Schema.String),
        Timeout: Schema.optional(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "ContainerStopOptions",
        title: "container.StopOptions",
    }
) {}
