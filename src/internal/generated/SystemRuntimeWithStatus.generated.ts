import * as Schema from "effect/Schema";
import * as SystemRuntime from "./SystemRuntime.generated.ts";

export class SystemRuntimeWithStatus extends Schema.Class<SystemRuntimeWithStatus>("SystemRuntimeWithStatus")(
    {
        ...SystemRuntime.SystemRuntime.fields,
        status: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
    },
    {
        identifier: "SystemRuntimeWithStatus",
        title: "system.RuntimeWithStatus",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/system#RuntimeWithStatus",
    }
) {}
