import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class ContainerPidsStats extends Schema.Class<ContainerPidsStats>("ContainerPidsStats")(
    {
        current: Schema.optional(
            MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
        ),
        limit: Schema.optional(
            MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
        ),
    },
    {
        identifier: "ContainerPidsStats",
        title: "container.PidsStats",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#PidsStats",
    }
) {}
