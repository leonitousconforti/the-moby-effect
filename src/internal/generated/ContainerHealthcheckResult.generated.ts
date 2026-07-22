import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class ContainerHealthcheckResult extends Schema.Class<ContainerHealthcheckResult>("ContainerHealthcheckResult")(
    {
        Start: Schema.NullOr(Schema.DateFromString),
        End: Schema.NullOr(Schema.DateFromString),
        ExitCode: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
        Output: Schema.String,
    },
    {
        identifier: "ContainerHealthcheckResult",
        title: "container.HealthcheckResult",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#HealthcheckResult",
    }
) {}
