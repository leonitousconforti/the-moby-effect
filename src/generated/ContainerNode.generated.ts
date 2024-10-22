import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerNode extends Schema.Class<ContainerNode>("ContainerNode")(
    {
        ID: Schema.String,
        IP: Schema.String,
        Addr: Schema.String,
        Name: Schema.String,
        Cpus: MobySchemas.Int64,
        Memory: MobySchemas.Int64,
        Labels: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
    },
    {
        identifier: "ContainerNode",
        title: "types.ContainerNode",
    }
) {}
