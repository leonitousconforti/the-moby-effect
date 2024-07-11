import * as Schema from "@effect/schema/Schema";

export class NetworksPruneReport extends Schema.Class<NetworksPruneReport>("NetworksPruneReport")({
    NetworksDeleted: Schema.Array(Schema.String),
}) {}
