import * as Schema from "@effect/schema/Schema";

export class SwarmEncryptionConfig extends Schema.Class<SwarmEncryptionConfig>("SwarmEncryptionConfig")(
    {
        AutoLockManagers: Schema.Boolean,
    },
    {
        identifier: "SwarmEncryptionConfig",
        title: "swarm.EncryptionConfig",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/swarm.go#L64-L70",
    }
) {}
