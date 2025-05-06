import * as Schema from "effect/Schema";

export class SwarmVolumeAttachment extends Schema.Class<SwarmVolumeAttachment>("SwarmVolumeAttachment")(
    {
        /** ID is the Swarmkit ID of the Volume. This is not the CSI VolumeId. */
        ID: Schema.optional(Schema.String),

        /**
         * Source, together with Target, indicates the Mount, as specified in
         * the ContainerSpec, that this volume fulfills.
         */
        Source: Schema.optional(Schema.String),

        /**
         * Target, together with Source, indicates the Mount, as specified in
         * the ContainerSpec, that this volume fulfills.
         */
        Target: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmVolumeAttachment",
        title: "swarm.VolumeAttachment",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/task.go#L213-L225",
    }
) {}
