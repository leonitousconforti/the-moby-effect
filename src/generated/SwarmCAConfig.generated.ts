import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SwarmCAConfig extends Schema.Class<SwarmCAConfig>("SwarmCAConfig")(
    {
        NodeCertExpiry: Schema.optional(MobySchemas.Int64),
        ExternalCAs: Schema.optional(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmExternalCA)), {
            nullable: true,
        }),
        SigningCACert: Schema.optional(Schema.String),
        SigningCAKey: Schema.optional(Schema.String),
        ForceRotate: Schema.optional(MobySchemas.UInt64),
    },
    {
        identifier: "SwarmCAConfig",
        title: "swarm.CAConfig",
    }
) {}
