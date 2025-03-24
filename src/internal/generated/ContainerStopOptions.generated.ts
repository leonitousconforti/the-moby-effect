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
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/config.go#L17-L33",
    }
) {}
