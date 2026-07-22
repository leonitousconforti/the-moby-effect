import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class ContainerRestartPolicy extends Schema.Class<ContainerRestartPolicy>("ContainerRestartPolicy")(
    {
        Name: Schema.Literals(["no", "always", "on-failure", "unless-stopped"]),
        MaximumRetryCount: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
    },
    {
        identifier: "ContainerRestartPolicy",
        title: "container.RestartPolicy",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#RestartPolicy",
    }
) {}
