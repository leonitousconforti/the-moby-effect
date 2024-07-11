import * as Schema from "@effect/schema/Schema";

export class Status extends Schema.Class<Status>("Status")({
    NodeState: Schema.String,
    ControlAvailable: Schema.Boolean,
}) {}
