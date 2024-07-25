import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

// FIXME: use custom schemas
export class NetIPNet extends Schema.Class<NetIPNet>("NetIPNet")(
    {
        IP: Schema.NullOr(Schema.Array(MobySchemas.UInt8)),
        Mask: Schema.NullOr(Schema.Array(MobySchemas.UInt8)),
    },
    {
        identifier: "NetIPNet",
        title: "registry.NetIPNet",
    }
) {}
