import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ContainerListOptions extends Schema.Class<ContainerListOptions>("ContainerListOptions")(
    {
        Size: Schema.NullOr(Schema.Boolean),
        All: Schema.NullOr(Schema.Boolean),
        Latest: Schema.NullOr(Schema.Boolean),
        Since: Schema.NullOr(Schema.String),
        Before: Schema.NullOr(Schema.String),
        Limit: Schema.NullOr(MobySchemas.Int64),
        Filters: MobySchemasGenerated.Args,
    },
    {
        identifier: "ContainerListOptions",
        title: "types.ContainerListOptions",
    }
) {}
