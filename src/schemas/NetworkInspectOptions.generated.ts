import * as Schema from "@effect/schema/Schema";

export class NetworkInspectOptions extends Schema.Class<NetworkInspectOptions>("NetworkInspectOptions")({
    Scope: Schema.String,
    Verbose: Schema.Boolean,
}) {}
