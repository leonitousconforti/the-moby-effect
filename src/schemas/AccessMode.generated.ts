import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class AccessMode extends Schema.Class<AccessMode>("AccessMode")({
    Scope: Schema.String,
    Sharing: Schema.String,
    MountVolume: MobySchemas.TypeMount,
    BlockVolume: MobySchemas.TypeBlock,
}) {}
