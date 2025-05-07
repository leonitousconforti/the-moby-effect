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
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/network/network.go#L120-L126",
    }
) {}
