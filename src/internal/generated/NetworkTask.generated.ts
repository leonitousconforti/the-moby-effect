import * as Schema from "effect/Schema";

export class NetworkTask extends Schema.Class<NetworkTask>("NetworkTask")(
    {
        Name: Schema.String,
        EndpointID: Schema.String,
        EndpointIP: Schema.String,
        Info: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
    },
    {
        identifier: "NetworkTask",
        title: "network.Task",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/network/network.go#L112-L118",
    }
) {}
