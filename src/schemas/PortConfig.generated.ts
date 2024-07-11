import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class PortConfig extends Schema.Class<PortConfig>("PortConfig")({
    Name: Schema.String,
    Protocol: Schema.String,
    TargetPort: MobySchemas.UInt32,
    PublishedPort: MobySchemas.UInt32,
    PublishMode: Schema.String,
}) {}
