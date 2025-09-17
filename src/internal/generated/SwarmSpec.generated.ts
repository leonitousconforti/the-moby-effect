import * as Schema from "effect/Schema";
import * as SwarmAnnotations from "./SwarmAnnotations.generated.js";
import * as SwarmCAConfig from "./SwarmCAConfig.generated.js";
import * as SwarmDispatcherConfig from "./SwarmDispatcherConfig.generated.js";
import * as SwarmEncryptionConfig from "./SwarmEncryptionConfig.generated.js";
import * as SwarmOrchestrationConfig from "./SwarmOrchestrationConfig.generated.js";
import * as SwarmRaftConfig from "./SwarmRaftConfig.generated.js";
import * as SwarmTaskDefaults from "./SwarmTaskDefaults.generated.js";

export class SwarmSpec extends Schema.Class<SwarmSpec>("SwarmSpec")(
    {
        ...SwarmAnnotations.SwarmAnnotations.fields,
        Orchestration: Schema.optionalWith(SwarmOrchestrationConfig.SwarmOrchestrationConfig, { nullable: true }),
        Raft: Schema.optionalWith(SwarmRaftConfig.SwarmRaftConfig, { nullable: true }),
        Dispatcher: Schema.optionalWith(SwarmDispatcherConfig.SwarmDispatcherConfig, { nullable: true }),
        CAConfig: Schema.optionalWith(SwarmCAConfig.SwarmCAConfig, { nullable: true }),
        TaskDefaults: Schema.optionalWith(SwarmTaskDefaults.SwarmTaskDefaults, { nullable: true }),
        EncryptionConfig: Schema.optionalWith(SwarmEncryptionConfig.SwarmEncryptionConfig, { nullable: true }),
    },
    {
        identifier: "SwarmSpec",
        title: "swarm.Spec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Spec",
    }
) {}
