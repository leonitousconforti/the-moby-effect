import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerStopOptions extends Schema.Class<ContainerStopOptions>("ContainerStopOptions")(
    {
        /**
         * Signal (optional) is the signal to send to the container to
         * (gracefully) stop it before forcibly terminating the container with
         * SIGKILL after the timeout expires. If not value is set, the default
         * (SIGTERM) is used.
         */
        Signal: Schema.optional(Schema.String),

        /**
         * Timeout (optional) is the timeout (in seconds) to wait for the
         * container to stop gracefully before forcibly terminating it with
         * SIGKILL.
         *
         * - Use nil to use the default timeout (10 seconds).
         * - Use '-1' to wait indefinitely.
         * - Use '0' to not wait for the container to exit gracefully, and
         *   immediately proceeds to forcibly terminating the container.
         * - Other positive values are used as timeout (in seconds).
         */
        Timeout: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "ContainerStopOptions",
        title: "container.StopOptions",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/config.go#L17-L33",
    }
) {}
