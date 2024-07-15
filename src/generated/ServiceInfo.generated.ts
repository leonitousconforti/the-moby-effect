import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ServiceInfo extends Schema.Class<ServiceInfo>("ServiceInfo")(
    {
        VIP: Schema.NullOr(Schema.String),
        Ports: Schema.NullOr(Schema.Array(Schema.String)),
        LocalLBIndex: Schema.NullOr(MobySchemas.Int64),
        Tasks: Schema.NullOr(Schema.Array(MobySchemasGenerated.Task)),
    },
    {
        identifier: "ServiceInfo",
        title: "network.ServiceInfo",
    }
) {}
