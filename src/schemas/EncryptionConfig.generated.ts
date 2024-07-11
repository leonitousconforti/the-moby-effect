import * as Schema from "@effect/schema/Schema";

export class EncryptionConfig extends Schema.Class<EncryptionConfig>("EncryptionConfig")({
    AutoLockManagers: Schema.Boolean,
}) {}
