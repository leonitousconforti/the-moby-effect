import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class NetIPNet extends Schema.Class<NetIPNet>("NetIPNet")(
    {
        IP: Schema.Array(MobySchemas.UInt8),
        Mask: Schema.Array(MobySchemas.UInt8),
    },
    {
        identifier: "NetIPNet",
        title: "registry.NetIPNet",
    }
) {}
