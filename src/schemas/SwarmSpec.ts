import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

/** User modifiable swarm configuration. */
export const SwarmSpec = S.Struct({
    /** Name of the swarm. */
    Name: S.optional(S.String),
    /** User-defined key/value metadata. */
    Labels: S.optional(S.Record(S.String, S.String)),
    /** Orchestration configuration. */
    Orchestration: S.optional(
        S.Struct({
            /**
             * The number of historic tasks to keep per instance or node. If
             * negative, never remove completed or failed tasks.
             */
            TaskHistoryRetentionLimit: S.optional(pipe(S.Number, S.int())),
        })
    ),
    /** Raft configuration. */
    Raft: S.optional(
        S.Struct({
            /** The number of log entries between snapshots. */
            SnapshotInterval: S.optional(pipe(S.Number, S.int())),
            /** The number of snapshots to keep beyond the current snapshot. */
            KeepOldSnapshots: S.optional(pipe(S.Number, S.int())),
            /**
             * The number of log entries to keep around to sync up slow
             * followers after a snapshot is created.
             */
            LogEntriesForSlowFollowers: S.optional(pipe(S.Number, S.int())),
            /**
             * The number of ticks that a follower will wait for a message from
             * the leader before becoming a candidate and starting an election.
             * `ElectionTick` must be greater than `HeartbeatTick`.
             *
             *     A tick currently defaults to one second, so these translate
             *     directly to seconds currently, but this is NOT guaranteed.
             */
            ElectionTick: S.optional(pipe(S.Number, S.int())),
            /**
             * The number of ticks between heartbeats. Every HeartbeatTick
             * ticks, the leader will send a heartbeat to the followers.
             *
             *     A tick currently defaults to one second, so these translate
             *     directly to seconds currently, but this is NOT guaranteed.
             */
            HeartbeatTick: S.optional(pipe(S.Number, S.int())),
        })
    ),
    /** Dispatcher configuration. */
    Dispatcher: S.optional(
        S.Struct({
            /** The delay for an agent to send a heartbeat to the dispatcher. */
            HeartbeatPeriod: S.optional(pipe(S.Number, S.int())),
        })
    ),
    /** CA configuration. */
    CAConfig: S.optional(
        S.Struct({
            /** The duration node certificates are issued for. */
            NodeCertExpiry: S.optional(pipe(S.Number, S.int())),
            /**
             * Configuration for forwarding signing requests to an external
             * certificate authority.
             */
            ExternalCAs: S.optional(
                S.Array(
                    S.Struct({
                        /**
                         * Protocol for communication with the external CA
                         * (currently only `cfssl` is supported).
                         */
                        Protocol: S.optional(S.Literal("cfssl"), {
                            default: () => "cfssl",
                        }),
                        /**
                         * URL where certificate signing requests should be
                         * sent.
                         */
                        URL: S.optional(S.String),
                        /**
                         * An object with key/value pairs that are interpreted
                         * as protocol-specific options for the external CA
                         * driver.
                         */
                        Options: S.optional(S.Record(S.String, S.String)),
                        /**
                         * The root CA certificate (in PEM format) this external
                         * CA uses to issue TLS certificates (assumed to be to
                         * the current swarm root CA certificate if not
                         * provided).
                         */
                        CACert: S.optional(S.String),
                    })
                )
            ),
            /**
             * The desired signing CA certificate for all swarm node TLS leaf
             * certificates, in PEM format.
             */
            SigningCACert: S.optional(S.String),
            /**
             * The desired signing CA key for all swarm node TLS leaf
             * certificates, in PEM format.
             */
            SigningCAKey: S.optional(S.String),
            /**
             * An integer whose purpose is to force swarm to generate a new
             * signing CA certificate and key, if none have been specified in
             * `SigningCACert` and `SigningCAKey`
             */
            ForceRotate: S.optional(pipe(S.Number, S.int())),
        })
    ),
    /** Parameters related to encryption-at-rest. */
    EncryptionConfig: S.optional(
        S.Struct({
            /**
             * If set, generate a key and use it to lock data stored on the
             * managers.
             */
            AutoLockManagers: S.optional(S.Boolean),
        })
    ),
    /** Defaults for creating tasks in this cluster. */
    TaskDefaults: S.optional(
        S.Struct({
            /**
             * The log driver to use for tasks created in the orchestrator if
             * unspecified by a service.
             *
             *     Updating this value only affects new tasks. Existing tasks continue
             *     to use their previously configured log driver until recreated.
             */
            LogDriver: S.optional(
                S.Struct({
                    /** The log driver to use as a default for new tasks. */
                    Name: S.optional(S.String),
                    /**
                     * Driver-specific options for the selectd log driver,
                     * specified as key/value pairs.
                     */
                    Options: S.optional(S.Record(S.String, S.String)),
                })
            ),
        })
    ),
});

export type SwarmSpec = S.Schema.Type<typeof SwarmSpec>;
export const SwarmSpecEncoded = S.encodedSchema(SwarmSpec);
export type SwarmSpecEncoded = S.Schema.Encoded<typeof SwarmSpec>;
