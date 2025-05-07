import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerWaitExitError from "./ContainerWaitExitError.generated.js";

export class ContainerWaitResponse extends Schema.Class<ContainerWaitResponse>("ContainerWaitResponse")(
    {
        Error: Schema.optionalWith(ContainerWaitExitError.ContainerWaitExitError, { nullable: true }),
        StatusCode: MobySchemas.Int64,
    },
    {
        identifier: "ContainerWaitResponse",
        title: "container.WaitResponse",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/wait_response.go#L6-L18",
    }
) {}
