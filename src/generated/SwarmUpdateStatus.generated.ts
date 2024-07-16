import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmUpdateStatus extends Schema.Class<SwarmUpdateStatus>("SwarmUpdateStatus")(
    {
        State: Schema.optional(Schema.String),
        StartedAt: Schema.optional(MobySchemasGenerated.Time, { nullable: true }),
        CompletedAt: Schema.optional(MobySchemasGenerated.Time, { nullable: true }),
        Message: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmUpdateStatus",
        title: "swarm.UpdateStatus",
    }
) {}
