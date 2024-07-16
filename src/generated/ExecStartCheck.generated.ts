import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ExecStartCheck extends Schema.Class<ExecStartCheck>("ExecStartCheck")(
    {
        Detach: Schema.Boolean,
        Tty: Schema.Boolean,
        ConsoleSize: Schema.optional(Schema.Array(MobySchemas.UInt64).pipe(Schema.itemsCount(2)), { nullable: true }),
    },
    {
        identifier: "ExecStartCheck",
        title: "types.ExecStartCheck",
    }
) {}
