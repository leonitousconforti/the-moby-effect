import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class UpdateStatus extends Schema.Class<UpdateStatus>("UpdateStatus")(
    {
        State: Schema.optional(Schema.String, { nullable: true }),
        StartedAt: Schema.optional(MobySchemasGenerated.Time, { nullable: true }),
        CompletedAt: Schema.optional(MobySchemasGenerated.Time, { nullable: true }),
        Message: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "UpdateStatus",
        title: "swarm.UpdateStatus",
    }
) {}
