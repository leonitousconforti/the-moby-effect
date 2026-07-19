import * as Schema from "effect/Schema";

export class UnitsUlimit extends Schema.Class<UnitsUlimit>("UnitsUlimit")(
    {
        Name: Schema.String,
        Hard: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        Soft: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
    },
    {
        identifier: "UnitsUlimit",
        title: "units.Ulimit",
        documentation: "",
    }
) {}
