import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmSpec extends Schema.Class<SwarmSpec>("SwarmSpec")(
    {
        Name: Schema.optional(Schema.String),
        Labels: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
        Orchestration: Schema.optionalWith(MobySchemasGenerated.SwarmOrchestrationConfig, { nullable: true }),
        Raft: Schema.optionalWith(MobySchemasGenerated.SwarmRaftConfig, { nullable: true }),
        Dispatcher: Schema.optionalWith(MobySchemasGenerated.SwarmDispatcherConfig, { nullable: true }),
        CAConfig: Schema.optionalWith(MobySchemasGenerated.SwarmCAConfig, { nullable: true }),
        TaskDefaults: Schema.optionalWith(MobySchemasGenerated.SwarmTaskDefaults, { nullable: true }),
        EncryptionConfig: Schema.optionalWith(MobySchemasGenerated.SwarmEncryptionConfig, { nullable: true }),
    },
    {
        identifier: "SwarmSpec",
        title: "swarm.Spec",
    }
) {}
