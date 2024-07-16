import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NetworkConnectRequest extends Schema.Class<NetworkConnectRequest>("NetworkConnectRequest")(
    {
        Container: Schema.String,
        EndpointConfig: Schema.optional(MobySchemasGenerated.NetworkEndpointSettings, { nullable: true }),
    },
    {
        identifier: "NetworkConnectRequest",
        title: "types.NetworkConnect",
    }
) {}
