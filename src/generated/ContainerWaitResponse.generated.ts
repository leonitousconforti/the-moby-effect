import * as Schema from "@effect/schema/Schema";
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
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/wait_response.go#L6-L18",
    }
) {}
