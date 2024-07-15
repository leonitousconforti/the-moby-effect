import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ExecStartCheck extends Schema.Class<ExecStartCheck>("ExecStartCheck")(
    {
        Detach: Schema.NullOr(Schema.Boolean),
        Tty: Schema.NullOr(Schema.Boolean),
        ConsoleSize: Schema.optional(Schema.Array(MobySchemas.UInt64), { nullable: true }),
    },
    {
        identifier: "ExecStartCheck",
        title: "types.ExecStartCheck",
    }
) {}
