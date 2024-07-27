import * as Schema from "@effect/schema/Schema";

export class NetworkTask extends Schema.Class<NetworkTask>("NetworkTask")(
    {
        Name: Schema.String,
        EndpointID: Schema.String,
        EndpointIP: Schema.String,
        Info: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
    },
    {
        identifier: "NetworkTask",
        title: "network.Task",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/network/network.go#L110-L116",
    }
) {}
