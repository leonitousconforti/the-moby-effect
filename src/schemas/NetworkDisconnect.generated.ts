import * as Schema from "@effect/schema/Schema";

export class NetworkDisconnect extends Schema.Class<NetworkDisconnect>("NetworkDisconnect")({
    Container: Schema.String,
    Force: Schema.Boolean,
}) {}
