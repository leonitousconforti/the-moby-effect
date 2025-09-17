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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#Task",
    }
) {}
