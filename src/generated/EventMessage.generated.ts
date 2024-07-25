import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

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
        ),
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
        ),
        Actor: Schema.NullOr(MobySchemasGenerated.EventActor),
        scope: Schema.optional(Schema.String),
        time: Schema.optional(MobySchemas.Int64),
        timeNano: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "EventMessage",
        title: "events.Message",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/events/events.go#L112-L128",
    }
) {}
