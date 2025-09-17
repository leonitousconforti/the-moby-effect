import * as Schema from "effect/Schema";

export class SwarmEncryptionConfig extends Schema.Class<SwarmEncryptionConfig>("SwarmEncryptionConfig")(
    {
        AutoLockManagers: Schema.Boolean,
    },
    {
        identifier: "SwarmEncryptionConfig",
        title: "swarm.EncryptionConfig",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#EncryptionConfig",
    }
) {}
