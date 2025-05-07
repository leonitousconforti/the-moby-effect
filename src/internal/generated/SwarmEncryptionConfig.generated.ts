import * as Schema from "effect/Schema";

export class SwarmEncryptionConfig extends Schema.Class<SwarmEncryptionConfig>("SwarmEncryptionConfig")(
    {
        /**
         * AutoLockManagers specifies whether or not managers TLS keys and raft
         * data should be encrypted at rest in such a way that they must be
         * unlocked before the manager node starts up again.
         */
        AutoLockManagers: Schema.Boolean,
    },
    {
        identifier: "SwarmEncryptionConfig",
        title: "swarm.EncryptionConfig",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/swarm.go#L64-L70",
    }
) {}
