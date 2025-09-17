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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#WaitResponse",
    }
) {}
