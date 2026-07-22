import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class ContainerStorageStats extends Schema.Class<ContainerStorageStats>("ContainerStorageStats")(
    {
        read_count_normalized: Schema.optional(
            MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
        ),
        read_size_bytes: Schema.optional(
            MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
        ),
        write_count_normalized: Schema.optional(
            MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
        ),
        write_size_bytes: Schema.optional(
            MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
        ),
    },
    {
        identifier: "ContainerStorageStats",
        title: "container.StorageStats",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#StorageStats",
    }
) {}
