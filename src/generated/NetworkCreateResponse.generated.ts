import * as Schema from "@effect/schema/Schema";

export class NetworkCreateResponse extends Schema.Class<NetworkCreateResponse>("NetworkCreateResponse")(
    {
        Id: Schema.String,
        Warning: Schema.String,
    },
    {
        identifier: "NetworkCreateResponse",
        title: "types.NetworkCreateResponse",
    }
) {}
