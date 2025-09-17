import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerPidsStats extends Schema.Class<ContainerPidsStats>("ContainerPidsStats")(
    {
        current: Schema.optional(MobySchemas.UInt64),
        limit: Schema.optional(MobySchemas.UInt64),
    },
    {
        identifier: "ContainerPidsStats",
        title: "container.PidsStats",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#PidsStats",
    }
) {}
