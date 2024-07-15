import * as Schema from "@effect/schema/Schema";

export class NetworkCreateResponse extends Schema.Class<NetworkCreateResponse>("NetworkCreateResponse")(
    {
        Id: Schema.NullOr(Schema.String),
        Warning: Schema.NullOr(Schema.String),
    },
    {
        identifier: "NetworkCreateResponse",
        title: "types.NetworkCreateResponse",
    }
) {}
