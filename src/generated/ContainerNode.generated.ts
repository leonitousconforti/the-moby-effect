import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerNode extends Schema.Class<ContainerNode>("ContainerNode")(
    {
        ID: Schema.NullOr(Schema.String),
        IP: Schema.NullOr(Schema.String),
        Addr: Schema.NullOr(Schema.String),
        Name: Schema.NullOr(Schema.String),
        Cpus: Schema.NullOr(MobySchemas.Int64),
        Memory: Schema.NullOr(MobySchemas.Int64),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
    },
    {
        identifier: "ContainerNode",
        title: "types.ContainerNode",
    }
) {}
