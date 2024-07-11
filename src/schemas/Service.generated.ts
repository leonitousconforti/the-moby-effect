import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Service extends Schema.Class<Service>("Service")({
    ID: Schema.String,
    Version: MobySchemas.Version,
    CreatedAt: MobySchemas.Time,
    UpdatedAt: MobySchemas.Time,
    Spec: MobySchemas.ServiceSpec,
    PreviousSpec: MobySchemas.ServiceSpec,
    Endpoint: MobySchemas.Endpoint,
    UpdateStatus: MobySchemas.UpdateStatus,
    ServiceStatus: MobySchemas.ServiceStatus,
    JobStatus: MobySchemas.JobStatus,
}) {}
