import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ExecStartOptions extends Schema.Class<ExecStartOptions>("ExecStartOptions")(
    {
        Stdin: Schema.Object,
        Stdout: Schema.Object,
        Stderr: Schema.Object,
        ConsoleSize: Schema.optional(Schema.Array(MobySchemas.UInt64), { nullable: true }),
    },
    {
        identifier: "ExecStartOptions",
        title: "container.ExecStartOptions",
    }
) {}
