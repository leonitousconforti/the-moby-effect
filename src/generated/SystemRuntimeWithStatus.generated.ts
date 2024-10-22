import * as Schema from "effect/Schema";
import * as SystemRuntime from "./SystemRuntime.generated.js";

export class SystemRuntimeWithStatus extends Schema.Class<SystemRuntimeWithStatus>("SystemRuntimeWithStatus")(
    {
        ...SystemRuntime.SystemRuntime.fields,
        status: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),
    },
    {
        identifier: "SystemRuntimeWithStatus",
        title: "system.RuntimeWithStatus",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/system/runtime.go#L16-L20",
    }
) {}
