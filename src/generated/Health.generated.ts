import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as HealthcheckResult from "./HealthcheckResult.generated.js";

export class Health extends Schema.Class<Health>("Health")(
    {
        Status: Schema.String,
        FailingStreak: MobySchemas.Int64,
        Log: Schema.NullOr(Schema.Array(Schema.NullOr(HealthcheckResult.HealthcheckResult))),
    },
    {
        identifier: "Health",
        title: "types.Health",
    }
) {}
