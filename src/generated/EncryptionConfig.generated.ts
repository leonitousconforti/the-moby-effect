import * as Schema from "@effect/schema/Schema";

export class EncryptionConfig extends Schema.Class<EncryptionConfig>("EncryptionConfig")(
    {
        AutoLockManagers: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "EncryptionConfig",
        title: "swarm.EncryptionConfig",
    }
) {}
