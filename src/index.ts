import { Effect, Layer, Scope } from "effect";

import * as AgentHelpers from "./agent-helpers.js";
import * as Configs from "./configs.js";
import * as Containers from "./containers.js";
import * as Distributions from "./distribution.js";
import * as Execs from "./execs.js";
import * as Images from "./images.js";
import * as Networks from "./networks.js";
import * as Nodes from "./nodes.js";
import * as Plugins from "./plugins.js";
import * as Secrets from "./secrets.js";
import * as Services from "./services.js";
import * as Sessions from "./session.js";
import * as Swarm from "./swarm.js";
import * as System from "./system.js";
import * as Tasks from "./tasks.js";
import * as Volumes from "./volumes.js";

export type { MobyConnectionOptions } from "./agent-helpers.js";
export { run } from "./custom-helpers.js";

export * as Configs from "./configs.js";
export * as Containers from "./containers.js";
export * as Distributions from "./distribution.js";
export * as Execs from "./execs.js";
export * as Images from "./images.js";
export * as Networks from "./networks.js";
export * as Nodes from "./nodes.js";
export * as Plugins from "./plugins.js";
export * as Schemas from "./schemas.js";
export * as Secrets from "./secrets.js";
export * as Services from "./services.js";
export * as Sessions from "./session.js";
export * as Swarm from "./swarm.js";
export * as System from "./system.js";
export * as Tasks from "./tasks.js";
export * as Volumes from "./volumes.js";

export type MobyApi = Layer.Layer<
    never,
    never,
    | Configs.Configs
    | Containers.Containers
    | Distributions.Distributions
    | Execs.Execs
    | Images.Images
    | Networks.Networks
    | Nodes.Nodes
    | Plugins.Plugins
    | Secrets.Secrets
    | Services.Services
    | Sessions.Sessions
    | Swarm.Swarms
    | System.Systems
    | Tasks.Tasks
    | Volumes.Volumes
>;

const layer = Layer.mergeAll(
    Configs.layer,
    Containers.layer,
    Distributions.layer,
    Execs.layer,
    Images.layer,
    Networks.layer,
    Nodes.layer,
    Plugins.layer,
    Secrets.layer,
    Services.layer,
    Sessions.layer,
    Swarm.layer,
    System.layer,
    Tasks.layer,
    Volumes.layer
);

export const fromAgent = (agent: Effect.Effect<Scope.Scope, never, AgentHelpers.IMobyConnectionAgent>): MobyApi =>
    layer.pipe(Layer.provide(Layer.scoped(AgentHelpers.MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: AgentHelpers.MobyConnectionOptions): MobyApi =>
    fromAgent(AgentHelpers.getAgent(connectionOptions));
