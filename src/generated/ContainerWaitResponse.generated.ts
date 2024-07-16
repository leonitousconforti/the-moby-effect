import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ContainerWaitResponse extends Schema.Class<ContainerWaitResponse>("ContainerWaitResponse")(
    {
        Error: Schema.optional(MobySchemasGenerated.ContainerWaitExitError, { nullable: true }),
        StatusCode: MobySchemas.Int64,
    },
    {
        identifier: "ContainerWaitResponse",
        title: "container.WaitResponse",
    }
) {}
