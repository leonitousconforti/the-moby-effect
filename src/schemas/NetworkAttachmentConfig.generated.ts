import * as Schema from "@effect/schema/Schema";

export class NetworkAttachmentConfig extends Schema.Class<NetworkAttachmentConfig>("NetworkAttachmentConfig")({
    Target: Schema.String,
    Aliases: Schema.Array(Schema.String),
    DriverOpts: Schema.Record(Schema.String, Schema.String),
}) {}
