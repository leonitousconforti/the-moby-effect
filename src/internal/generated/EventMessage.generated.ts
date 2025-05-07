import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as EventActor from "./EventActor.generated.js";

export class EventMessage extends Schema.Class<EventMessage>("EventMessage")(
    {
        status: Schema.optional(Schema.String),
        id: Schema.optional(Schema.String),
        from: Schema.optional(Schema.String),
        Type: Schema.Literal(
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
            "volume"
        ).annotations({
            documentation:
                "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/events/events.go#L4-L20",
        }),
        Action: Schema.Literal(
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
            "health_status: unhealthy"
        ).annotations({
            documentation:
                "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/events/events.go#L22-L100",
        }),
        Actor: Schema.NullOr(EventActor.EventActor),
        scope: Schema.optional(Schema.String),
        time: Schema.optional(MobySchemas.Int64),
        timeNano: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "EventMessage",
        title: "events.Message",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/events/events.go#L112-L128",
    }
) {}
