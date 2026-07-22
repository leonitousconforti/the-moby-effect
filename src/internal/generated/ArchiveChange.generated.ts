import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class ArchiveChange extends Schema.Class<ArchiveChange>("ArchiveChange")(
    {
        Path: Schema.String,
        Kind: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
    },
    {
        identifier: "ArchiveChange",
        title: "archive.Change",
        documentation: "",
    }
) {}
