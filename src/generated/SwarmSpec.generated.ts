import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmSpec extends Schema.Class<SwarmSpec>("SwarmSpec")(
    {
        Name: Schema.optional(Schema.String),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Orchestration: Schema.optional(MobySchemasGenerated.SwarmOrchestrationConfig),
        Raft: Schema.optional(MobySchemasGenerated.SwarmRaftConfig),
        Dispatcher: Schema.optional(MobySchemasGenerated.SwarmDispatcherConfig),
        CAConfig: Schema.optional(MobySchemasGenerated.SwarmCAConfig),
        TaskDefaults: Schema.optional(MobySchemasGenerated.SwarmTaskDefaults),
        EncryptionConfig: Schema.optional(MobySchemasGenerated.SwarmEncryptionConfig),
    },
    {
        identifier: "SwarmSpec",
        title: "swarm.Spec",
    }
) {}
