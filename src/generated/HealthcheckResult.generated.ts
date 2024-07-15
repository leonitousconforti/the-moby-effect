import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class HealthcheckResult extends Schema.Class<HealthcheckResult>("HealthcheckResult")(
    {
        Start: MobySchemasGenerated.Time,
        End: MobySchemasGenerated.Time,
        ExitCode: Schema.NullOr(MobySchemas.Int64),
        Output: Schema.NullOr(Schema.String),
    },
    {
        identifier: "HealthcheckResult",
        title: "types.HealthcheckResult",
    }
) {}
