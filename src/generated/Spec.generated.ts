import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class Spec extends Schema.Class<Spec>("Spec")(
    {
        Name: Schema.optional(Schema.String, { nullable: true }),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Orchestration: Schema.optional(MobySchemasGenerated.OrchestrationConfig),
        Raft: Schema.optional(MobySchemasGenerated.RaftConfig),
        Dispatcher: Schema.optional(MobySchemasGenerated.DispatcherConfig),
        CAConfig: Schema.optional(MobySchemasGenerated.CAConfig),
        TaskDefaults: Schema.optional(MobySchemasGenerated.TaskDefaults),
        EncryptionConfig: Schema.optional(MobySchemasGenerated.EncryptionConfig),
    },
    {
        identifier: "Spec",
        title: "swarm.Spec",
    }
) {}
