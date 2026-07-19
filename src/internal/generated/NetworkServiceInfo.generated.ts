import * as Schema from "effect/Schema";
import * as NetworkTask from "./NetworkTask.generated.ts";

export class NetworkServiceInfo extends Schema.Class<NetworkServiceInfo>("NetworkServiceInfo")(
    {
        VIP: Schema.String,
        Ports: Schema.NullOr(Schema.Array(Schema.String)),
        LocalLBIndex: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        Tasks: Schema.NullOr(Schema.Array(Schema.NullOr(NetworkTask.NetworkTask))),
    },
    {
        identifier: "NetworkServiceInfo",
        title: "network.ServiceInfo",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#ServiceInfo",
    }
) {}
