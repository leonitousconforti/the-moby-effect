import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ServiceMode extends Schema.Class<ServiceMode>("ServiceMode")({
    Replicated: MobySchemas.ReplicatedService,
    Global: MobySchemas.GlobalService,
    ReplicatedJob: MobySchemas.ReplicatedJob,
    GlobalJob: MobySchemas.GlobalJob,
}) {}
