import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerFilesystemChange extends Schema.Class<ContainerFilesystemChange>("ContainerFilesystemChange")(
    {
        Kind: MobySchemas.UInt8,
        Path: Schema.String,
    },
    {
        identifier: "ContainerFilesystemChange",
        title: "container.FilesystemChange",
    }
) {}
