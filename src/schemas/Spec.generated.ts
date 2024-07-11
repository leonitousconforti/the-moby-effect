import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Spec extends Schema.Class<Spec>("Spec")({
    Name: Schema.String,
    Labels: Schema.Record(Schema.String, Schema.String),
    Orchestration: MobySchemas.OrchestrationConfig,
    Raft: MobySchemas.RaftConfig,
    Dispatcher: MobySchemas.DispatcherConfig,
    CAConfig: MobySchemas.CAConfig,
    TaskDefaults: MobySchemas.TaskDefaults,
    EncryptionConfig: MobySchemas.EncryptionConfig,
}) {}
