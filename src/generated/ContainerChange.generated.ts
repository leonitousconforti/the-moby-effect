import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerChange extends Schema.Class<ContainerChange>("ContainerChange")(
    {
        Path: Schema.String,
        Kind: MobySchemas.Int64,
    },
    {
        identifier: "ContainerChange",
        title: "archive.Change",
    }
) {}
