import * as Schema from "@effect/schema/Schema";

export class SystemCommit extends Schema.Class<SystemCommit>("SystemCommit")(
    {
        ID: Schema.String,
        Expected: Schema.String,
    },
    {
        identifier: "SystemCommit",
        title: "system.Commit",
    }
) {}
