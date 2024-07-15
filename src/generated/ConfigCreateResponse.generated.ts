import * as Schema from "@effect/schema/Schema";

export class ConfigCreateResponse extends Schema.Class<ConfigCreateResponse>("ConfigCreateResponse")(
    {
        ID: Schema.NullOr(Schema.String),
    },
    {
        identifier: "ConfigCreateResponse",
        title: "types.ConfigCreateResponse",
    }
) {}
