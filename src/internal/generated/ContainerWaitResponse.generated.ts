import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";
import * as ContainerWaitExitError from "./ContainerWaitExitError.generated.ts";

export class ContainerWaitResponse extends Schema.Class<ContainerWaitResponse>("ContainerWaitResponse")(
    {
        Error: Schema.optional(Schema.NullOr(ContainerWaitExitError.ContainerWaitExitError)),
        StatusCode: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
    },
    {
        identifier: "ContainerWaitResponse",
        title: "container.WaitResponse",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#WaitResponse",
    }
) {}
