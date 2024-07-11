import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ServiceSpec extends Schema.Class<ServiceSpec>("ServiceSpec")({
    Name: Schema.String,
    Labels: Schema.Record(Schema.String, Schema.String),
    TaskTemplate: MobySchemas.TaskSpec,
    Mode: MobySchemas.ServiceMode,
    UpdateConfig: MobySchemas.UpdateConfig,
    RollbackConfig: MobySchemas.UpdateConfig,
    Networks: Schema.Array(MobySchemas.NetworkAttachmentConfig),
    EndpointSpec: MobySchemas.EndpointSpec,
}) {}
