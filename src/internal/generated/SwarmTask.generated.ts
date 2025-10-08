import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as SwarmAnnotations from "./SwarmAnnotations.generated.js";
import * as SwarmGenericResource from "./SwarmGenericResource.generated.js";
import * as SwarmMeta from "./SwarmMeta.generated.js";
import * as SwarmNetworkAttachment from "./SwarmNetworkAttachment.generated.js";
import * as SwarmTaskSpec from "./SwarmTaskSpec.generated.js";
import * as SwarmTaskStatus from "./SwarmTaskStatus.generated.js";
import * as SwarmVersion from "./SwarmVersion.generated.js";
import * as SwarmVolumeAttachment from "./SwarmVolumeAttachment.generated.js";

export class SwarmTask extends Schema.Class<SwarmTask>("SwarmTask")(
    {
        ID: Schema.String,
        ...SwarmMeta.SwarmMeta.fields,
        ...SwarmAnnotations.SwarmAnnotations.fields,
        Spec: Schema.optionalWith(SwarmTaskSpec.SwarmTaskSpec, { nullable: true }),
        ServiceID: Schema.optional(Schema.String),
        Slot: Schema.optional(EffectSchemas.Number.I64),
        NodeID: Schema.optional(Schema.String),
        Status: Schema.optionalWith(SwarmTaskStatus.SwarmTaskStatus, { nullable: true }),
        DesiredState: Schema.optional(
            Schema.Literal(
                "new",
                "allocated",
                "pending",
                "assigned",
                "accepted",
                "preparing",
                "ready",
                "starting",
                "running",
                "complete",
                "shutdown",
                "failed",
                "rejected",
                "remove",
                "orphaned"
            )
        ),
        NetworksAttachments: Schema.optionalWith(
            Schema.Array(Schema.NullOr(SwarmNetworkAttachment.SwarmNetworkAttachment)),
            { nullable: true }
        ),
        GenericResources: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmGenericResource.SwarmGenericResource)), {
            nullable: true,
        }),
        JobIteration: Schema.optionalWith(SwarmVersion.SwarmVersion, { nullable: true }),
        Volumes: Schema.NullOr(Schema.Array(Schema.NullOr(SwarmVolumeAttachment.SwarmVolumeAttachment))),
    },
    {
        identifier: "SwarmTask",
        title: "swarm.Task",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Task",
    }
) {}
