import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerNode extends Schema.Class<ContainerNode>("ContainerNode")(
    {
        ID: Schema.String,
        IP: Schema.String,
        Addr: Schema.String,
        Name: Schema.String,
        Cpus: MobySchemas.Int64,
        Memory: MobySchemas.Int64,
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
    },
    {
        identifier: "ContainerNode",
        title: "types.ContainerNode",
    }
) {}
