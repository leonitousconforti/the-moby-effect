import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NetworkConnectOptions extends Schema.Class<NetworkConnectOptions>("NetworkConnectOptions")(
    {
        Container: Schema.String,
        EndpointConfig: Schema.optionalWith(MobySchemasGenerated.NetworkEndpointSettings, { nullable: true }),
    },
    {
        identifier: "NetworkConnectOptions",
        title: "network.ConnectOptions",
    }
) {}
