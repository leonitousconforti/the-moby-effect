import * as Schema from "@effect/schema/Schema";

export class PublishStatus extends Schema.Class<PublishStatus>("PublishStatus")({
    NodeID: Schema.String,
    State: Schema.String,
    PublishContext: Schema.Record(Schema.String, Schema.String),
}) {}
