import * as Schema from "effect/Schema";

export class SystemCommit extends Schema.Class<SystemCommit>("SystemCommit")(
    {
        ID: Schema.String,
        Expected: Schema.optional(Schema.String),
    },
    {
        identifier: "SystemCommit",
        title: "system.Commit",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/system/info.go#L138-L148",
    }
) {}
