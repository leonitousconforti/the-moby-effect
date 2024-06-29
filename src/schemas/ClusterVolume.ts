import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { ClusterVolumeSpec } from "./ClusterVolumeSpec.js";
import { ObjectVersion } from "./ObjectVersion.js";
import { Topology } from "./Topology.js";

/**
 * Options and information specific to, and only present on, Swarm CSI cluster
 * volumes.
 */
export const ClusterVolume = S.Struct({
    /**
     * The Swarm ID of this volume. Because cluster volumes are Swarm objects,
     * they have an ID, unlike non-cluster volumes. This ID can be used to refer
     * to the Volume instead of the name.
     */
    ID: S.optional(S.String),
    Version: S.optional(ObjectVersion),
    CreatedAt: S.optional(S.String),
    UpdatedAt: S.optional(S.String),
    Spec: S.optional(ClusterVolumeSpec),
    /** Information about the global status of the volume. */
    Info: S.optional(
        S.Struct({
            /**
             * The capacity of the volume in bytes. A value of 0 indicates that
             * the capacity is unknown.
             */
            CapacityBytes: S.optional(pipe(S.Number, S.int())),
            /**
             * A map of strings to strings returned from the storage plugin when
             * the volume is created.
             */
            VolumeContext: S.optional(S.Record(S.String, S.String)),
            /**
             * The ID of the volume as returned by the CSI storage plugin. This
             * is distinct from the volume's ID as provided by Docker. This ID
             * is never used by the user when communicating with Docker to refer
             * to this volume. If the ID is blank, then the Volume has not been
             * successfully created in the plugin yet.
             */
            VolumeID: S.optional(S.String),
            /** The topology this volume is actually accessible from. */
            AccessibleTopology: S.optional(S.Array(Topology)),
        })
    ),
    /**
     * The status of the volume as it pertains to its publishing and use on
     * specific nodes
     */
    PublishStatus: S.optional(
        S.Array(
            S.Struct({
                /** The ID of the Swarm node the volume is published on. */
                NodeID: S.optional(S.String),
                /**
                 * The published state of the volume. `pending-publish` The
                 * volume should be published to this node, but the call to the
                 * controller plugin to do so has not yet been successfully
                 * completed. `published` The volume is published successfully
                 * to the node. `pending-node-unpublish` The volume should be
                 * unpublished from the node, and the manager is awaiting
                 * confirmation from the worker that it has done so.
                 * `pending-controller-unpublish` The volume is successfully
                 * unpublished from the node, but has not yet been successfully
                 * unpublished on the controller.
                 */
                State: S.optional(
                    S.Literal("pending-publish", "published", "pending-node-unpublish", "pending-controller-unpublish")
                ),
                /**
                 * A map of strings to strings returned by the CSI controller
                 * plugin when a volume is published.
                 */
                PublishContext: S.optional(S.Record(S.String, S.String)),
            })
        )
    ),
});

export type ClusterVolume = S.Schema.Type<typeof ClusterVolume>;
export const ClusterVolumeEncoded = S.encodedSchema(ClusterVolume);
export type ClusterVolumeEncoded = S.Schema.Encoded<typeof ClusterVolume>;
