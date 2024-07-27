import * as Schema from "@effect/schema/Schema";
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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/network/network.go#L118-L124",
    }
) {}
