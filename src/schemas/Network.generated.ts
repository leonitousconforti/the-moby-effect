import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Network extends Schema.Class<Network>("Network")({
    ID: Schema.String,
    Version: MobySchemas.Version,
    CreatedAt: MobySchemas.Time,
    UpdatedAt: MobySchemas.Time,
    Spec: MobySchemas.NetworkSpec,
    DriverState: MobySchemas.Driver,
    IPAMOptions: MobySchemas.IPAMOptions,
}) {}
