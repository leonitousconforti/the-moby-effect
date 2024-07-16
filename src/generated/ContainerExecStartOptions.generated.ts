import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerExecStartOptions extends Schema.Class<ContainerExecStartOptions>("ContainerExecStartOptions")(
    {
        Stdin: Schema.Object,
        Stdout: Schema.Object,
        Stderr: Schema.Object,
        ConsoleSize: Schema.optional(Schema.Array(MobySchemas.UInt64).pipe(Schema.itemsCount(2)), { nullable: true }),
    },
    {
        identifier: "ContainerExecStartOptions",
        title: "container.ExecStartOptions",
    }
) {}
