import * as Schema from "effect/Schema";
import * as SystemRuntime from "./SystemRuntime.generated.js";

export class SystemRuntimeWithStatus extends Schema.Class<SystemRuntimeWithStatus>("SystemRuntimeWithStatus")(
    {
        ...SystemRuntime.SystemRuntime.fields,
        status: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
    },
    {
        identifier: "SystemRuntimeWithStatus",
        title: "system.RuntimeWithStatus",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/system/runtime.go#L16-L20",
    }
) {}
