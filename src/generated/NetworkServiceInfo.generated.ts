import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class NetworkServiceInfo extends Schema.Class<NetworkServiceInfo>("NetworkServiceInfo")(
    {
        VIP: Schema.String,
        Ports: Schema.NullOr(Schema.Array(Schema.String)),
        LocalLBIndex: MobySchemas.Int64,
        Tasks: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.NetworkTask))),
    },
    {
        identifier: "NetworkServiceInfo",
        title: "network.ServiceInfo",
    }
) {}
