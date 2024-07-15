import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class CAConfig extends Schema.Class<CAConfig>("CAConfig")(
    {
        NodeCertExpiry: Schema.optional(MobySchemas.Int64, { nullable: true }),
        ExternalCAs: Schema.optional(Schema.Array(MobySchemasGenerated.ExternalCA), { nullable: true }),
        SigningCACert: Schema.optional(Schema.String, { nullable: true }),
        SigningCAKey: Schema.optional(Schema.String, { nullable: true }),
        ForceRotate: Schema.optional(MobySchemas.UInt64, { nullable: true }),
    },
    {
        identifier: "CAConfig",
        title: "swarm.CAConfig",
    }
) {}
