import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";
import * as SwarmAnnotations from "./SwarmAnnotations.generated.ts";
import * as SwarmGenericResource from "./SwarmGenericResource.generated.ts";
import * as SwarmMeta from "./SwarmMeta.generated.ts";
import * as SwarmNetworkAttachment from "./SwarmNetworkAttachment.generated.ts";
import * as SwarmTaskSpec from "./SwarmTaskSpec.generated.ts";
import * as SwarmTaskStatus from "./SwarmTaskStatus.generated.ts";
import * as SwarmVersion from "./SwarmVersion.generated.ts";
import * as SwarmVolumeAttachment from "./SwarmVolumeAttachment.generated.ts";

export class SwarmTask extends Schema.Class<SwarmTask>("SwarmTask")(
    {
        ID: MobyIdentifiers.TaskIdentifier,
        ...SwarmMeta.SwarmMeta.fields,
        ...SwarmAnnotations.SwarmAnnotations.fields,
        Spec: Schema.optional(Schema.NullOr(SwarmTaskSpec.SwarmTaskSpec)),
        ServiceID: Schema.optional(MobyIdentifiers.ServiceIdentifier),
        Slot: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))),
        NodeID: Schema.optional(MobyIdentifiers.NodeIdentifier),
        Status: Schema.optional(Schema.NullOr(SwarmTaskStatus.SwarmTaskStatus)),
        DesiredState: Schema.optional(Schema.Literals(["new", "allocated", "pending", "assigned", "accepted", "preparing", "ready", "starting", "running", "complete", "shutdown", "failed", "rejected", "remove", "orphaned"])),
        NetworksAttachments: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(SwarmNetworkAttachment.SwarmNetworkAttachment)))),
        GenericResources: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(SwarmGenericResource.SwarmGenericResource)))),
        JobIteration: Schema.optional(Schema.NullOr(SwarmVersion.SwarmVersion)),
        Volumes: Schema.NullOr(Schema.Array(Schema.NullOr(SwarmVolumeAttachment.SwarmVolumeAttachment))),
    },
    {
        identifier: "SwarmTask",
        title: "swarm.Task",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Task",
    }
) {}
