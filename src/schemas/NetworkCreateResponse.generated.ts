import * as Schema from "@effect/schema/Schema";

export class NetworkCreateResponse extends Schema.Class<NetworkCreateResponse>("NetworkCreateResponse")({
    ID: Schema.String,
    Warning: Schema.String,
}) {}
