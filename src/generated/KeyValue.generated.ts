import * as Schema from "@effect/schema/Schema";

export class KeyValue extends Schema.Class<KeyValue>("KeyValue")(
    {
        Key: Schema.NullOr(Schema.String),
        Value: Schema.NullOr(Schema.String),
    },
    {
        identifier: "KeyValue",
        title: "types.KeyValue",
    }
) {}
