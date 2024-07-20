import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NetworkNetworkingConfig extends Schema.Class<NetworkNetworkingConfig>("NetworkNetworkingConfig")(
    {
        EndpointsConfig: Schema.NullOr(Schema.Record(Schema.String, MobySchemasGenerated.NetworkEndpointSettings)),
    },
    {
        identifier: "NetworkNetworkingConfig",
        title: "network.NetworkingConfig",
    }
) {}
