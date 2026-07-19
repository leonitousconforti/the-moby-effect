import * as Schema from "effect/Schema";
import * as SwarmAnnotations from "./SwarmAnnotations.generated.ts";
import * as SwarmCAConfig from "./SwarmCAConfig.generated.ts";
import * as SwarmDispatcherConfig from "./SwarmDispatcherConfig.generated.ts";
import * as SwarmEncryptionConfig from "./SwarmEncryptionConfig.generated.ts";
import * as SwarmOrchestrationConfig from "./SwarmOrchestrationConfig.generated.ts";
import * as SwarmRaftConfig from "./SwarmRaftConfig.generated.ts";
import * as SwarmTaskDefaults from "./SwarmTaskDefaults.generated.ts";

export class SwarmSpec extends Schema.Class<SwarmSpec>("SwarmSpec")(
    {
        ...SwarmAnnotations.SwarmAnnotations.fields,
        Orchestration: Schema.optional(Schema.NullOr(SwarmOrchestrationConfig.SwarmOrchestrationConfig)),
        Raft: Schema.optional(Schema.NullOr(SwarmRaftConfig.SwarmRaftConfig)),
        Dispatcher: Schema.optional(Schema.NullOr(SwarmDispatcherConfig.SwarmDispatcherConfig)),
        CAConfig: Schema.optional(Schema.NullOr(SwarmCAConfig.SwarmCAConfig)),
        TaskDefaults: Schema.optional(Schema.NullOr(SwarmTaskDefaults.SwarmTaskDefaults)),
        EncryptionConfig: Schema.optional(Schema.NullOr(SwarmEncryptionConfig.SwarmEncryptionConfig)),
    },
    {
        identifier: "SwarmSpec",
        title: "swarm.Spec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Spec",
    }
) {}
