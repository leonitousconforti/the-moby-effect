import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as Health from "./Health.generated.js";

export class State extends Schema.Class<State>("State")(
    {
        Status: Schema.String,
        Running: Schema.Boolean,
        Paused: Schema.Boolean,
        Restarting: Schema.Boolean,
        OOMKilled: Schema.Boolean,
        Dead: Schema.Boolean,
        Pid: MobySchemas.Int64,
        ExitCode: MobySchemas.Int64,
        Error: Schema.String,
        StartedAt: Schema.String,
        FinishedAt: Schema.String,
        Health: Schema.optionalWith(Health.Health, { nullable: true }),
    },
    {
        identifier: "State",
        title: "container.State",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/container.go#L104-L119",
    }
) {}
