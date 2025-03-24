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
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/stats.go#L82-L89",
    }
) {}
