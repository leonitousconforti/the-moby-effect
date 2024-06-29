import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { EndpointPortConfig } from "./EndpointPortConfig.js";
import { EndpointSpec } from "./EndpointSpec.js";
import { ObjectVersion } from "./ObjectVersion.js";
import { ServiceSpec } from "./ServiceSpec.js";

export const Service = S.Struct({
    ID: S.optional(S.String),
    Version: S.optional(ObjectVersion),
    CreatedAt: S.optional(S.String),
    UpdatedAt: S.optional(S.String),
    Spec: S.optional(ServiceSpec),
    Endpoint: S.optional(
        S.Struct({
            Spec: S.optional(EndpointSpec),
            Ports: S.optional(S.Array(EndpointPortConfig)),
            VirtualIPs: S.optional(
                S.Array(
                    S.Struct({
                        NetworkID: S.optional(S.String),
                        Addr: S.optional(S.String),
                    })
                )
            ),
        })
    ),
    /** The status of a service update. */
    UpdateStatus: S.optional(
        S.Struct({
            State: S.optional(S.Literal("updating", "paused", "completed")),
            StartedAt: S.optional(S.String),
            CompletedAt: S.optional(S.String),
            Message: S.optional(S.String),
        })
    ),
    /**
     * The status of the service's tasks. Provided only when requested as part
     * of a ServiceList operation.
     */
    ServiceStatus: S.optional(
        S.Struct({
            /**
             * The number of tasks for the service currently in the Running
             * state.
             */
            RunningTasks: S.optional(pipe(S.Number, S.int())),
            /**
             * The number of tasks for the service desired to be running. For
             * replicated services, this is the replica count from the service
             * spec. For global services, this is computed by taking count of
             * all tasks for the service with a Desired State other than
             * Shutdown.
             */
            DesiredTasks: S.optional(pipe(S.Number, S.int())),
            /**
             * The number of tasks for a job that are in the Completed state.
             * This field must be cross-referenced with the service type, as the
             * value of 0 may mean the service is not in a job mode, or it may
             * mean the job-mode service has no tasks yet Completed.
             */
            CompletedTasks: S.optional(pipe(S.Number, S.int())),
        })
    ),
    /**
     * The status of the service when it is in one of ReplicatedJob or GlobalJob
     * modes. Absent on Replicated and Global mode services. The JobIteration is
     * an ObjectVersion, but unlike the Service's version, does not need to be
     * sent with an update request.
     */
    JobStatus: S.optional(
        S.Struct({
            JobIteration: S.optional(ObjectVersion),
            /**
             * The last time, as observed by the server, that this job was
             * started.
             */
            LastExecution: S.optional(S.String),
        })
    ),
});

export type Service = S.Schema.Type<typeof Service>;
export const ServiceEncoded = S.encodedSchema(Service);
export type ServiceEncoded = S.Schema.Encoded<typeof Service>;
