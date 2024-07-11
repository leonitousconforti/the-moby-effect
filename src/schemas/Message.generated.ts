import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Message extends Schema.Class<Message>("Message")({
    Status: Schema.String,
    ID: Schema.String,
    From: Schema.String,
    Type: Schema.String,
    Action: Schema.String,
    Actor: MobySchemas.Actor,
    Scope: Schema.String,
    Time: MobySchemas.Int64,
    TimeNano: MobySchemas.Int64,
}) {}
