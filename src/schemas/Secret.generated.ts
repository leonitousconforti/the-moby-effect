import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Secret extends Schema.Class<Secret>("Secret")({
    ID: Schema.String,
    Version: MobySchemas.Version,
    CreatedAt: MobySchemas.Time,
    UpdatedAt: MobySchemas.Time,
    Spec: MobySchemas.SecretSpec,
}) {}
