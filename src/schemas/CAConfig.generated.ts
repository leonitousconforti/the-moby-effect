import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class CAConfig extends Schema.Class<CAConfig>("CAConfig")({
    NodeCertExpiry: MobySchemas.Int64,
    ExternalCAs: Schema.Array(MobySchemas.ExternalCA),
    SigningCACert: Schema.String,
    SigningCAKey: Schema.String,
    ForceRotate: MobySchemas.UInt64,
}) {}
