import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class Message extends Schema.Class<Message>("Message")(
    {
        status: Schema.optional(Schema.String, { nullable: true }),
        id: Schema.optional(Schema.String, { nullable: true }),
        from: Schema.optional(Schema.String, { nullable: true }),
        Type: Schema.NullOr(Schema.String),
        Action: Schema.NullOr(Schema.String),
        Actor: MobySchemasGenerated.Actor,
        scope: Schema.optional(Schema.String, { nullable: true }),
        time: Schema.optional(MobySchemas.Int64, { nullable: true }),
        timeNano: Schema.optional(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "Message",
        title: "events.Message",
    }
) {}
