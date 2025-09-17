import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerBlkioStatEntry extends Schema.Class<ContainerBlkioStatEntry>("ContainerBlkioStatEntry")(
    {
        major: MobySchemas.UInt64,
        minor: MobySchemas.UInt64,
        op: Schema.String,
        value: MobySchemas.UInt64,
    },
    {
        identifier: "ContainerBlkioStatEntry",
        title: "container.BlkioStatEntry",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#BlkioStatEntry",
    }
) {}
