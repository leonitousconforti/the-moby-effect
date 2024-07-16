import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class Swarm extends Schema.Class<Swarm>("Swarm")(
    {
        ID: Schema.String,
        Version: Schema.optional(MobySchemasGenerated.SwarmVersion),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time),
        Spec: MobySchemasGenerated.SwarmSpec,
        TLSInfo: MobySchemasGenerated.SwarmTLSInfo,
        RootRotationInProgress: Schema.Boolean,
        DefaultAddrPool: Schema.NullOr(Schema.Array(Schema.String)),
        SubnetSize: MobySchemas.UInt32,
        DataPathPort: MobySchemas.UInt32,
        JoinTokens: MobySchemasGenerated.SwarmJoinTokens,
    },
    {
        identifier: "Swarm",
        title: "swarm.Swarm",
    }
) {}
