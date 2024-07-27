import * as Schema from "@effect/schema/Schema";

export class SystemCommit extends Schema.Class<SystemCommit>("SystemCommit")(
    {
        ID: Schema.String,
        Expected: Schema.String,
    },
    {
        identifier: "SystemCommit",
        title: "system.Commit",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/system/info.go#L137-L142",
    }
) {}
