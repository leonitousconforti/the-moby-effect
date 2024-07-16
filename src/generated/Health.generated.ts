import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class Health extends Schema.Class<Health>("Health")(
    {
        Status: Schema.String,
        FailingStreak: MobySchemas.Int64,
        Log: Schema.NullOr(Schema.Array(MobySchemasGenerated.HealthcheckResult)),
    },
    {
        identifier: "Health",
        title: "types.Health",
    }
) {}
