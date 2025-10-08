import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as ContainerWaitExitError from "./ContainerWaitExitError.generated.js";

export class ContainerWaitResponse extends Schema.Class<ContainerWaitResponse>("ContainerWaitResponse")(
    {
        Error: Schema.optionalWith(ContainerWaitExitError.ContainerWaitExitError, { nullable: true }),
        StatusCode: EffectSchemas.Number.I64,
    },
    {
        identifier: "ContainerWaitResponse",
        title: "container.WaitResponse",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#WaitResponse",
    }
) {}
