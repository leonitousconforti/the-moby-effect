import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as NetworkTask from "./NetworkTask.generated.js";

export class NetworkServiceInfo extends Schema.Class<NetworkServiceInfo>("NetworkServiceInfo")(
    {
        VIP: Schema.String,
        Ports: Schema.NullOr(Schema.Array(Schema.String)),
        LocalLBIndex: MobySchemas.Int64,
        Tasks: Schema.NullOr(Schema.Array(Schema.NullOr(NetworkTask.NetworkTask))),
    },
    {
        identifier: "NetworkServiceInfo",
        title: "network.ServiceInfo",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#ServiceInfo",
    }
) {}
