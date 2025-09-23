import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class RegistryNetIPNet extends Schema.Class<RegistryNetIPNet>("RegistryNetIPNet")(
    {
        IP: Schema.NullOr(Schema.Array(MobySchemas.UInt8)),
        Mask: Schema.NullOr(Schema.Array(MobySchemas.UInt8)),
    },
    {
        identifier: "RegistryNetIPNet",
        title: "registry.NetIPNet",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/registry#NetIPNet",
    }
) {}
