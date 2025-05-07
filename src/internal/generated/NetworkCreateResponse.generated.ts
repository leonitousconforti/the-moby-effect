import * as Schema from "effect/Schema";

export class NetworkCreateResponse extends Schema.Class<NetworkCreateResponse>("NetworkCreateResponse")(
    {
        Id: Schema.String,
        Warning: Schema.String,
    },
    {
        identifier: "NetworkCreateResponse",
        title: "network.CreateResponse",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/network/create_response.go#L6-L19",
    }
) {}
