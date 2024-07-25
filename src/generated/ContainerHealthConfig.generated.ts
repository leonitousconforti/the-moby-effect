import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerHealthConfig extends Schema.Class<ContainerHealthConfig>("ContainerHealthConfig")(
    {
        // Test is the test to perform to check that the container is healthy.
        // An empty slice means to inherit the default.
        // The options are:
        // {} : inherit healthcheck
        // {"NONE"} : disable healthcheck
        // {"CMD", args...} : exec arguments directly
        // {"CMD-SHELL", command} : run command with system's default shell
        Test: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

        /** Interval is the time to wait between checks. */
        Interval: Schema.optional(MobySchemas.Int64),

        /**
         * Timeout is the time to wait before considering the check to have
         * hung.
         */
        Timeout: Schema.optional(MobySchemas.Int64),

        /**
         * The start period for the container to initialize before the retries
         * starts to count down.
         */
        StartPeriod: Schema.optional(MobySchemas.Int64),

        /** The interval to attempt health checks at during the start period */
        StartInterval: Schema.optional(MobySchemas.Int64),

        /**
         * Retries is the number of consecutive failures needed to consider a
         * container as unhealthy.
         */
        Retries: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "ContainerHealthConfig",
        title: "v1.HealthcheckConfig",
        documentation:
            "https://github.com/moby/docker-image-spec/blob/f1d00ebd2d6d6805170d5543dbca4b850f35f9af/specs-go/v1/image.go#L34-L54",
    }
) {}
