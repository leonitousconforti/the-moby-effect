import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmUpdateStatus extends Schema.Class<SwarmUpdateStatus>("SwarmUpdateStatus")(
    {
        State: Schema.optional(Schema.String),
        StartedAt: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
        CompletedAt: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
        Message: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmUpdateStatus",
        title: "swarm.UpdateStatus",
    }
) {}
