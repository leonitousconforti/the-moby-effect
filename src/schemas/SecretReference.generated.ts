import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class SecretReference extends Schema.Class<SecretReference>("SecretReference")({
    File: MobySchemas.SecretReferenceFileTarget,
    SecretID: Schema.String,
    SecretName: Schema.String,
}) {}
