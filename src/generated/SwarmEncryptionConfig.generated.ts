import * as Schema from "@effect/schema/Schema";

export class SwarmEncryptionConfig extends Schema.Class<SwarmEncryptionConfig>("SwarmEncryptionConfig")(
    {
        AutoLockManagers: Schema.Boolean,
    },
    {
        identifier: "SwarmEncryptionConfig",
        title: "swarm.EncryptionConfig",
    }
) {}
