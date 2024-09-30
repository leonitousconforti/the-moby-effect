import * as Schema from "@effect/schema/Schema";

export class NetworkCreateResponse extends Schema.Class<NetworkCreateResponse>("NetworkCreateResponse")(
    {
        Id: Schema.String,
        Warning: Schema.String,
    },
    {
        identifier: "NetworkCreateResponse",
        title: "network.CreateResponse",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/network/create_response.go#L6-L19",
    }
) {}
