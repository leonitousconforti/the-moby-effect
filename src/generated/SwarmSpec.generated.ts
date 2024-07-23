import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmSpec extends Schema.Class<SwarmSpec>("SwarmSpec")(
    {
        Name: Schema.optional(Schema.String),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Orchestration: Schema.optional(MobySchemasGenerated.SwarmOrchestrationConfig, { nullable: true }),
        Raft: Schema.optional(MobySchemasGenerated.SwarmRaftConfig, { nullable: true }),
        Dispatcher: Schema.optional(MobySchemasGenerated.SwarmDispatcherConfig, { nullable: true }),
        CAConfig: Schema.optional(MobySchemasGenerated.SwarmCAConfig, { nullable: true }),
        TaskDefaults: Schema.optional(MobySchemasGenerated.SwarmTaskDefaults, { nullable: true }),
        EncryptionConfig: Schema.optional(MobySchemasGenerated.SwarmEncryptionConfig, { nullable: true }),
    },
    {
        identifier: "SwarmSpec",
        title: "swarm.Spec",
    }
) {}
