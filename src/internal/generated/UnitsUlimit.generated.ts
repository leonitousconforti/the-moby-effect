import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class UnitsUlimit extends Schema.Class<UnitsUlimit>("UnitsUlimit")(
    {
        Name: Schema.String,
        Hard: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
        Soft: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
    },
    {
        identifier: "UnitsUlimit",
        title: "units.Ulimit",
        documentation: "",
    }
) {}
