import * as Schema from "effect/Schema";

import * as ContainerHealthcheckResult from "./ContainerHealthcheckResult.generated.ts";

export class ContainerHealth extends Schema.Class<ContainerHealth>("ContainerHealth")(
    {
        Status: Schema.Literals(["none", "starting", "healthy", "unhealthy"]),
        FailingStreak: Schema.BigIntFromString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
        Log: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerHealthcheckResult.ContainerHealthcheckResult))),
    },
    {
        identifier: "ContainerHealth",
        title: "container.Health",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#Health",
    }
) {}
