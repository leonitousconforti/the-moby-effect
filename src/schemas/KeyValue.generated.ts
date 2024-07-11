import * as Schema from "@effect/schema/Schema";

export class KeyValue extends Schema.Class<KeyValue>("KeyValue")({
    Key: Schema.String,
    Value: Schema.String,
}) {}
