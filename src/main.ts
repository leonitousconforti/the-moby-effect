import { Data, Effect, Scope } from "effect";
import ssh2 from "ssh2";

import { getAgent, IMobyConnectionAgent, MobyConnectionAgent } from "./agent-helpers.js";
import { run, runWithConnectionAgentProvided } from "./custom-helpers.js";

import * as Config from "./configs.js";
import * as Container from "./containers.js";
import * as Distribution from "./distribution.js";
import * as Exec from "./exec.js";
import * as Image from "./images.js";
import * as Network from "./networks.js";
import * as Node from "./nodes.js";
import * as Plugin from "./plugins.js";
import * as Secret from "./secrets.js";
import * as Service from "./services.js";
import * as Session from "./session.js";
import * as Swarm from "./swarm.js";
import * as System from "./system.js";
import * as Task from "./tasks.js";
import * as Volume from "./volumes.js";

export * from "./configs.js";
export * from "./containers.js";
export * from "./distribution.js";
export * from "./exec.js";
export * from "./images.js";
export * from "./networks.js";
export * from "./nodes.js";
export * from "./plugins.js";
export * from "./schemas.js";
export * from "./secrets.js";
export * from "./services.js";
export * from "./session.js";
export * from "./swarm.js";
export * from "./system.js";
export * from "./tasks.js";
export * from "./volumes.js";

/** How to connect to your moby/docker instance. */
export type MobyConnectionOptions =
    | { protocol: "unix"; socketPath: string }
    | { protocol: "http"; host: string; port: number }
    | ({ protocol: "ssh"; socketPath: string } & ssh2.ConnectConfig)
    | { protocol: "https"; host: string; port: number; cert: string; ca: string; key: string };

/** Interface for the effect layer that we will construct later. */
export interface IMobyService
    extends Omit<Config.IConfigService, "Errors">,
        Omit<Container.IContainerService, "Errors">,
        Omit<Distribution.IDistributionService, "Errors">,
        Omit<Exec.IExecService, "Errors">,
        Omit<Image.IImageService, "Errors">,
        Omit<Network.INetworkService, "Errors">,
        Omit<Node.INodeService, "Errors">,
        Omit<Plugin.IPluginService, "Errors">,
        Omit<Secret.ISecretService, "Errors">,
        Omit<Service.IServicesService, "Errors">,
        Omit<Session.ISessionService, "Errors">,
        Omit<Swarm.ISwarmService, "Errors">,
        Omit<System.ISystemService, "Errors">,
        Omit<Task.ITaskService, "Errors">,
        Omit<Plugin.IPluginService, "Errors">,
        Omit<Volume.IVolumeService, "Errors"> {
    readonly run: runWithConnectionAgentProvided;
    readonly connectionAgent: Effect.Effect<Scope.Scope, never, IMobyConnectionAgent>;
}

/** Generic Moby service error */
export class MobyError extends Data.TaggedError("MobyServiceError")<{
    cause:
        | MobyError
        | Config.IConfigService["Errors"]
        | Container.IContainerService["Errors"]
        | Distribution.IDistributionService["Errors"]
        | Exec.IExecService["Errors"]
        | Image.IImageService["Errors"]
        | Network.INetworkService["Errors"]
        | Node.INodeService["Errors"]
        | Plugin.IPluginService["Errors"]
        | Secret.ISecretService["Errors"]
        | Service.IServicesService["Errors"]
        | Session.ISessionService["Errors"]
        | Swarm.ISwarmService["Errors"]
        | System.ISystemService["Errors"]
        | Task.ITaskService["Errors"]
        | Volume.IVolumeService["Errors"];
    message: string;
}> {}

export const makeMobyClient = (mobyConnectionOptions?: MobyConnectionOptions | undefined): IMobyService => {
    // Set the default options to connect to the docker server on this host
    const localMobyConnectionOptions: MobyConnectionOptions = mobyConnectionOptions || {
        protocol: "unix",
        socketPath: "/var/run/docker.sock",
    };

    // Helper to map any errors to the generic MobyError
    const mapMobyError: <R, E extends MobyError["cause"], A>(
        self: Effect.Effect<R, E, A>
    ) => Effect.Effect<R, MobyError, A> = Effect.mapError(
        (cause: MobyError["cause"]) => new MobyError({ cause, message: `${cause._tag}+${cause.message}` })
    );

    // Helper to provide the connection agent to all the endpoints that will need it below
    const provideAgent: <R, E, A>(
        self: Effect.Effect<R, E, A>
    ) => Effect.Effect<Scope.Scope | Exclude<R, IMobyConnectionAgent>, E, A> = Effect.provideServiceEffect(
        MobyConnectionAgent,
        getAgent(localMobyConnectionOptions)
    );

    // Performs both error mapping and agent providing
    const wrapper =
        <T extends unknown[], R extends IMobyConnectionAgent, E extends MobyError["cause"], A>(
            self: (...arguments_: T) => Effect.Effect<R, E, A>
        ): ((..._: T) => Effect.Effect<Scope.Scope | Exclude<R, IMobyConnectionAgent>, MobyError, A>) =>
        (..._: T) =>
            self(..._)
                .pipe(mapMobyError)
                .pipe(provideAgent);

    return {
        connectionAgent: getAgent(localMobyConnectionOptions),
        run: wrapper(run),
        configCreate: wrapper(Config.configCreate),
        configDelete: wrapper(Config.configDelete),
        configInspect: wrapper(Config.configInspect),
        configList: wrapper(Config.configList),
        configUpdate: wrapper(Config.configUpdate),
        containerArchive: wrapper(Container.containerArchive),
        containerArchiveInfo: wrapper(Container.containerArchiveInfo),
        containerAttach: wrapper(Container.containerAttach),
        containerChanges: wrapper(Container.containerChanges),
        containerCreate: wrapper(Container.containerCreate),
        containerDelete: wrapper(Container.containerDelete),
        containerExport: wrapper(Container.containerExport),
        containerInspect: wrapper(Container.containerInspect),
        containerKill: wrapper(Container.containerKill),
        containerList: wrapper(Container.containerList),
        containerLogs: wrapper(Container.containerLogs),
        containerPause: wrapper(Container.containerPause),
        containerPrune: wrapper(Container.containerPrune),
        containerRename: wrapper(Container.containerRename),
        containerResize: wrapper(Container.containerResize),
        containerRestart: wrapper(Container.containerRestart),
        containerStart: wrapper(Container.containerStart),
        containerStats: wrapper(Container.containerStats),
        containerStop: wrapper(Container.containerStop),
        containerTop: wrapper(Container.containerTop),
        containerUnpause: wrapper(Container.containerUnpause),
        containerUpdate: wrapper(Container.containerUpdate),
        containerWait: wrapper(Container.containerWait),
        putContainerArchive: wrapper(Container.putContainerArchive),
        distributionInspect: wrapper(Distribution.distributionInspect),
        containerExec: wrapper(Exec.containerExec),
        execInspect: wrapper(Exec.execInspect),
        execResize: wrapper(Exec.execResize),
        execStart: wrapper(Exec.execStart),
        buildPrune: wrapper(Image.buildPrune),
        imageBuild: wrapper(Image.imageBuild),
        imageCommit: wrapper(Image.imageCommit),
        imageCreate: wrapper(Image.imageCreate),
        imageDelete: wrapper(Image.imageDelete),
        imageGet: wrapper(Image.imageGet),
        imageGetAll: wrapper(Image.imageGetAll),
        imageHistory: wrapper(Image.imageHistory),
        imageInspect: wrapper(Image.imageInspect),
        imageList: wrapper(Image.imageList),
        imageLoad: wrapper(Image.imageLoad),
        imagePrune: wrapper(Image.imagePrune),
        imagePush: wrapper(Image.imagePush),
        imageSearch: wrapper(Image.imageSearch),
        imageTag: wrapper(Image.imageTag),
        networkConnect: wrapper(Network.networkConnect),
        networkCreate: wrapper(Network.networkCreate),
        networkDelete: wrapper(Network.networkDelete),
        networkDisconnect: wrapper(Network.networkDisconnect),
        networkInspect: wrapper(Network.networkInspect),
        networkList: wrapper(Network.networkList),
        networkPrune: wrapper(Network.networkPrune),
        nodeDelete: wrapper(Node.nodeDelete),
        nodeInspect: wrapper(Node.nodeInspect),
        nodeList: wrapper(Node.nodeList),
        nodeUpdate: wrapper(Node.nodeUpdate),
        getPluginPrivileges: wrapper(Plugin.getPluginPrivileges),
        pluginCreate: wrapper(Plugin.pluginCreate),
        pluginDelete: wrapper(Plugin.pluginDelete),
        pluginDisable: wrapper(Plugin.pluginDisable),
        pluginEnable: wrapper(Plugin.pluginEnable),
        pluginInspect: wrapper(Plugin.pluginInspect),
        pluginList: wrapper(Plugin.pluginList),
        pluginPull: wrapper(Plugin.pluginPull),
        pluginPush: wrapper(Plugin.pluginPush),
        pluginSet: wrapper(Plugin.pluginSet),
        pluginUpgrade: wrapper(Plugin.pluginUpgrade),
        secretCreate: wrapper(Secret.secretCreate),
        secretDelete: wrapper(Secret.secretDelete),
        secretInspect: wrapper(Secret.secretInspect),
        secretList: wrapper(Secret.secretList),
        secretUpdate: wrapper(Secret.secretUpdate),
        serviceCreate: wrapper(Service.serviceCreate),
        serviceDelete: wrapper(Service.serviceDelete),
        serviceInspect: wrapper(Service.serviceInspect),
        serviceList: wrapper(Service.serviceList),
        serviceLogs: wrapper(Service.serviceLogs),
        serviceUpdate: wrapper(Service.serviceUpdate),
        session: wrapper(Session.session),
        swarmInit: wrapper(Swarm.swarmInit),
        swarmInspect: wrapper(Swarm.swarmInspect),
        swarmJoin: wrapper(Swarm.swarmJoin),
        swarmLeave: wrapper(Swarm.swarmLeave),
        swarmUnlock: wrapper(Swarm.swarmUnlock),
        swarmUnlockkey: wrapper(Swarm.swarmUnlockkey),
        swarmUpdate: wrapper(Swarm.swarmUpdate),
        systemAuth: wrapper(System.systemAuth),
        systemDataUsage: wrapper(System.systemDataUsage),
        systemEvents: wrapper(System.systemEvents),
        systemInfo: wrapper(System.systemInfo),
        systemPing: wrapper(System.systemPing),
        systemPingHead: wrapper(System.systemPingHead),
        systemVersion: wrapper(System.systemVersion),
        taskInspect: wrapper(Task.taskInspect),
        taskList: wrapper(Task.taskList),
        taskLogs: wrapper(Task.taskLogs),
        volumeCreate: wrapper(Volume.volumeCreate),
        volumeDelete: wrapper(Volume.volumeDelete),
        volumeInspect: wrapper(Volume.volumeInspect),
        volumeList: wrapper(Volume.volumeList),
        volumePrune: wrapper(Volume.volumePrune),
        volumeUpdate: wrapper(Volume.volumeUpdate),
    };
};
