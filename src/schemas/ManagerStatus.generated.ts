import * as Schema from "@effect/schema/Schema";

export class ManagerStatus extends Schema.Class<ManagerStatus>("ManagerStatus")({
    Leader: Schema.Boolean,
    Reachability: Schema.String,
    Addr: Schema.String,
}) {}
