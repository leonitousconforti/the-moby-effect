import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";
import * as EventsActor from "./EventsActor.generated.ts";

export class EventsMessage extends Schema.Class<EventsMessage>("EventsMessage")(
    {
        status: Schema.optional(Schema.String),
        id: Schema.optional(Schema.String),
        from: Schema.optional(Schema.String),
        Type: Schema.Literals([
            "builder",
            "config",
            "container",
            "daemon",
            "image",
            "network",
            "node",
            "plugin",
            "secret",
            "service",
            "volume",
        ]),
        Action: Schema.Literals([
            "create",
            "start",
            "restart",
            "stop",
            "checkpoint",
            "pause",
            "unpause",
            "attach",
            "detach",
            "resize",
            "update",
            "rename",
            "kill",
            "die",
            "oom",
            "destroy",
            "remove",
            "commit",
            "top",
            "copy",
            "archive-path",
            "extract-to-dir",
            "export",
            "import",
            "save",
            "load",
            "tag",
            "untag",
            "push",
            "pull",
            "prune",
            "delete",
            "enable",
            "disable",
            "connect",
            "disconnect",
            "reload",
            "mount",
            "unmount",
            "exec_create",
            "exec_start",
            "exec_die",
            "exec_detach",
            "health_status",
            "health_status: running",
            "health_status: healthy",
            "health_status: unhealthy",
        ]),
        Actor: Schema.NullOr(EventsActor.EventsActor),
        scope: Schema.optional(Schema.String),
        time: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        timeNano: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
    },
    {
        identifier: "EventsMessage",
        title: "events.Message",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/events#Message",
    }
) {}
