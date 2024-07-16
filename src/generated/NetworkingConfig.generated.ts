import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NetworkingConfig extends Schema.Class<NetworkingConfig>("NetworkingConfig")(
    {
        EndpointsConfig: Schema.NullOr(Schema.Record(Schema.String, MobySchemasGenerated.NetworkEndpointSettings)),
    },
    {
        identifier: "NetworkingConfig",
        title: "network.NetworkingConfig",
    }
) {}
