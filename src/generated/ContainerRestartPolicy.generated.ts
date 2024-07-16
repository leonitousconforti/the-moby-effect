import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerRestartPolicy extends Schema.Class<ContainerRestartPolicy>("ContainerRestartPolicy")(
    {
        Name: Schema.String,
        MaximumRetryCount: MobySchemas.Int64,
    },
    {
        identifier: "ContainerRestartPolicy",
        title: "container.RestartPolicy",
    }
) {}
