import * as Schema from "effect/Schema";

export class SystemCommit extends Schema.Class<SystemCommit>("SystemCommit")(
    {
        ID: Schema.String,
        Expected: Schema.optional(Schema.String),
    },
    {
        identifier: "SystemCommit",
        title: "system.Commit",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/system#Commit",
    }
) {}
