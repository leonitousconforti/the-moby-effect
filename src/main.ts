import { Context, Data, Effect, Layer, Scope } from "effect";
import ssh2 from "ssh2";

import { getAgent, IMobyConnectionAgent, MobyConnectionAgent } from "./agent-helpers.js";
import { run } from "./custom-helpers.js";

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
    extends Config.IConfigService,
        Container.IContainerService,
        Distribution.IDistributionService,
        Exec.IExecService,
        Image.IImageService,
        Network.INetworkService,
        Node.INodeService,
        Plugin.IPluginService,
        Secret.ISecretService,
        Service.IServicesService,
        Session.ISessionService,
        Swarm.ISwarmService,
        System.ISystemService,
        Task.ITaskService,
        Plugin.IPluginService,
        Volume.IVolumeService {
    readonly run: typeof run;
    readonly connectionAgent: Effect.Effect<Scope.Scope, never, IMobyConnectionAgent>;
}

/**
 * Keeps track of what client tags have already been instantiated to prevent
 * duplicate instantiation.
 */
const instantiatedClientTags: Set<`${string}MobyClient`> = new Set<`${string}MobyClient`>();
export class MobyClientAlreadyInstantiated extends Data.TaggedError("MobyClientAlreadyInstantiated")<{
    message: string;
}> {}

export const makeMobyLayer = <ContextIdentifier extends `${string}MobyClient`>(
    contextIdentifier: ContextIdentifier,
    mobyConnectionOptions?: MobyConnectionOptions | undefined
): [
    contextTag: Context.Tag<ContextIdentifier, IMobyService>,
    layer: Layer.Layer<never, MobyClientAlreadyInstantiated, ContextIdentifier>,
] => {
    // Check to see if this client tag has already been instantiated
    if (instantiatedClientTags.has(contextIdentifier)) {
        return [
            Context.Tag(),
            Layer.fail(new MobyClientAlreadyInstantiated({ message: "Client already instantiated" })),
        ];
    }

    // Set the default options to connect to the docker server on this host
    const localMobyConnectionOptions: MobyConnectionOptions =
        mobyConnectionOptions || ({ protocol: "unix", socketPath: "/var/run/docker.sock" } as const);

    // Helper to provide the connection agent to all the endpoints that will need it below
    const provideAgent = (): (<R, E, A>(
        self: Effect.Effect<R, E, A>
    ) => Effect.Effect<Scope.Scope | Exclude<R, IMobyConnectionAgent>, E, A>) =>
        Effect.provideServiceEffect(MobyConnectionAgent, getAgent(localMobyConnectionOptions));

    // The context tag for this client
    const contextTag: Context.Tag<ContextIdentifier, IMobyService> = Context.Tag<ContextIdentifier, IMobyService>();

    // Now we can construct the layer!
    const layer: Layer.Layer<never, never, ContextIdentifier> = Layer.succeed(
        contextTag,
        contextTag.of({
            run,
            connectionAgent: getAgent(localMobyConnectionOptions),
            configCreate: (...arguments_) => Config.configCreate(...arguments_).pipe(provideAgent()),
            configDelete: (...arguments_) => Config.configDelete(...arguments_).pipe(provideAgent()),
            configInspect: (...arguments_) => Config.configInspect(...arguments_).pipe(provideAgent()),
            configList: (...arguments_) => Config.configList(...arguments_).pipe(provideAgent()),
            configUpdate: (...arguments_) => Config.configUpdate(...arguments_).pipe(provideAgent()),
            containerArchive: (...arguments_) => Container.containerArchive(...arguments_).pipe(provideAgent()),
            containerArchiveInfo: (...arguments_) => Container.containerArchiveInfo(...arguments_).pipe(provideAgent()),
            containerAttach: (...arguments_) => Container.containerAttach(...arguments_).pipe(provideAgent()),
            containerAttachWebsocket: (...arguments_) =>
                Container.containerAttachWebsocket(...arguments_).pipe(provideAgent()),
            containerChanges: (...arguments_) => Container.containerChanges(...arguments_).pipe(provideAgent()),
            containerCreate: (...arguments_) => Container.containerCreate(...arguments_).pipe(provideAgent()),
            containerDelete: (...arguments_) => Container.containerDelete(...arguments_).pipe(provideAgent()),
            containerExport: (...arguments_) => Container.containerExport(...arguments_).pipe(provideAgent()),
            containerInspect: (...arguments_) => Container.containerInspect(...arguments_).pipe(provideAgent()),
            containerKill: (...arguments_) => Container.containerKill(...arguments_).pipe(provideAgent()),
            containerList: (...arguments_) => Container.containerList(...arguments_).pipe(provideAgent()),
            containerLogs: (...arguments_) => Container.containerLogs(...arguments_).pipe(provideAgent()),
            containerPause: (...arguments_) => Container.containerPause(...arguments_).pipe(provideAgent()),
            containerPrune: (...arguments_) => Container.containerPrune(...arguments_).pipe(provideAgent()),
            containerRename: (...arguments_) => Container.containerRename(...arguments_).pipe(provideAgent()),
            containerResize: (...arguments_) => Container.containerResize(...arguments_).pipe(provideAgent()),
            containerRestart: (...arguments_) => Container.containerRestart(...arguments_).pipe(provideAgent()),
            containerStart: (...arguments_) => Container.containerStart(...arguments_).pipe(provideAgent()),
            containerStats: (...arguments_) => Container.containerStats(...arguments_).pipe(provideAgent()),
            containerStop: (...arguments_) => Container.containerStop(...arguments_).pipe(provideAgent()),
            containerTop: (...arguments_) => Container.containerTop(...arguments_).pipe(provideAgent()),
            containerUnpause: (...arguments_) => Container.containerUnpause(...arguments_).pipe(provideAgent()),
            containerUpdate: (...arguments_) => Container.containerUpdate(...arguments_).pipe(provideAgent()),
            containerWait: (...arguments_) => Container.containerWait(...arguments_).pipe(provideAgent()),
            putContainerArchive: (...arguments_) => Container.putContainerArchive(...arguments_).pipe(provideAgent()),
            distributionInspect: (...arguments_) =>
                Distribution.distributionInspect(...arguments_).pipe(provideAgent()),
            containerExec: (...arguments_) => Exec.containerExec(...arguments_).pipe(provideAgent()),
            execInspect: (...arguments_) => Exec.execInspect(...arguments_).pipe(provideAgent()),
            execResize: (...arguments_) => Exec.execResize(...arguments_).pipe(provideAgent()),
            execStart: (...arguments_) => Exec.execStart(...arguments_).pipe(provideAgent()),
            buildPrune: (...arguments_) => Image.buildPrune(...arguments_).pipe(provideAgent()),
            imageBuild: (...arguments_) => Image.imageBuild(...arguments_).pipe(provideAgent()),
            imageCommit: (...arguments_) => Image.imageCommit(...arguments_).pipe(provideAgent()),
            imageCreate: (...arguments_) => Image.imageCreate(...arguments_).pipe(provideAgent()),
            imageDelete: (...arguments_) => Image.imageDelete(...arguments_).pipe(provideAgent()),
            imageGet: (...arguments_) => Image.imageGet(...arguments_).pipe(provideAgent()),
            imageGetAll: (...arguments_) => Image.imageGetAll(...arguments_).pipe(provideAgent()),
            imageHistory: (...arguments_) => Image.imageHistory(...arguments_).pipe(provideAgent()),
            imageInspect: (...arguments_) => Image.imageInspect(...arguments_).pipe(provideAgent()),
            imageList: (...arguments_) => Image.imageList(...arguments_).pipe(provideAgent()),
            imageLoad: (...arguments_) => Image.imageLoad(...arguments_).pipe(provideAgent()),
            imagePrune: (...arguments_) => Image.imagePrune(...arguments_).pipe(provideAgent()),
            imagePush: (...arguments_) => Image.imagePush(...arguments_).pipe(provideAgent()),
            imageSearch: (...arguments_) => Image.imageSearch(...arguments_).pipe(provideAgent()),
            imageTag: (...arguments_) => Image.imageTag(...arguments_).pipe(provideAgent()),
            networkConnect: (...arguments_) => Network.networkConnect(...arguments_).pipe(provideAgent()),
            networkCreate: (...arguments_) => Network.networkCreate(...arguments_).pipe(provideAgent()),
            networkDelete: (...arguments_) => Network.networkDelete(...arguments_).pipe(provideAgent()),
            networkDisconnect: (...arguments_) => Network.networkDisconnect(...arguments_).pipe(provideAgent()),
            networkInspect: (...arguments_) => Network.networkInspect(...arguments_).pipe(provideAgent()),
            networkList: (...arguments_) => Network.networkList(...arguments_).pipe(provideAgent()),
            networkPrune: (...arguments_) => Network.networkPrune(...arguments_).pipe(provideAgent()),
            nodeDelete: (...arguments_) => Node.nodeDelete(...arguments_).pipe(provideAgent()),
            nodeInspect: (...arguments_) => Node.nodeInspect(...arguments_).pipe(provideAgent()),
            nodeList: (...arguments_) => Node.nodeList(...arguments_).pipe(provideAgent()),
            nodeUpdate: (...arguments_) => Node.nodeUpdate(...arguments_).pipe(provideAgent()),
            getPluginPrivileges: (...arguments_) => Plugin.getPluginPrivileges(...arguments_).pipe(provideAgent()),
            pluginCreate: (...arguments_) => Plugin.pluginCreate(...arguments_).pipe(provideAgent()),
            pluginDelete: (...arguments_) => Plugin.pluginDelete(...arguments_).pipe(provideAgent()),
            pluginDisable: (...arguments_) => Plugin.pluginDisable(...arguments_).pipe(provideAgent()),
            pluginEnable: (...arguments_) => Plugin.pluginEnable(...arguments_).pipe(provideAgent()),
            pluginInspect: (...arguments_) => Plugin.pluginInspect(...arguments_).pipe(provideAgent()),
            pluginList: (...arguments_) => Plugin.pluginList(...arguments_).pipe(provideAgent()),
            pluginPull: (...arguments_) => Plugin.pluginPull(...arguments_).pipe(provideAgent()),
            pluginPush: (...arguments_) => Plugin.pluginPush(...arguments_).pipe(provideAgent()),
            pluginSet: (...arguments_) => Plugin.pluginSet(...arguments_).pipe(provideAgent()),
            pluginUpgrade: (...arguments_) => Plugin.pluginUpgrade(...arguments_).pipe(provideAgent()),
            secretCreate: (...arguments_) => Secret.secretCreate(...arguments_).pipe(provideAgent()),
            secretDelete: (...arguments_) => Secret.secretDelete(...arguments_).pipe(provideAgent()),
            secretInspect: (...arguments_) => Secret.secretInspect(...arguments_).pipe(provideAgent()),
            secretList: (...arguments_) => Secret.secretList(...arguments_).pipe(provideAgent()),
            secretUpdate: (...arguments_) => Secret.secretUpdate(...arguments_).pipe(provideAgent()),
            serviceCreate: (...arguments_) => Service.serviceCreate(...arguments_).pipe(provideAgent()),
            serviceDelete: (...arguments_) => Service.serviceDelete(...arguments_).pipe(provideAgent()),
            serviceInspect: (...arguments_) => Service.serviceInspect(...arguments_).pipe(provideAgent()),
            serviceList: (...arguments_) => Service.serviceList(...arguments_).pipe(provideAgent()),
            serviceLogs: (...arguments_) => Service.serviceLogs(...arguments_).pipe(provideAgent()),
            serviceUpdate: (...arguments_) => Service.serviceUpdate(...arguments_).pipe(provideAgent()),
            session: (...arguments_) => Session.session(...arguments_).pipe(provideAgent()),
            swarmInit: (...arguments_) => Swarm.swarmInit(...arguments_).pipe(provideAgent()),
            swarmInspect: (...arguments_) => Swarm.swarmInspect(...arguments_).pipe(provideAgent()),
            swarmJoin: (...arguments_) => Swarm.swarmJoin(...arguments_).pipe(provideAgent()),
            swarmLeave: (...arguments_) => Swarm.swarmLeave(...arguments_).pipe(provideAgent()),
            swarmUnlock: (...arguments_) => Swarm.swarmUnlock(...arguments_).pipe(provideAgent()),
            swarmUnlockkey: (...arguments_) => Swarm.swarmUnlockkey(...arguments_).pipe(provideAgent()),
            swarmUpdate: (...arguments_) => Swarm.swarmUpdate(...arguments_).pipe(provideAgent()),
            systemAuth: (...arguments_) => System.systemAuth(...arguments_).pipe(provideAgent()),
            systemDataUsage: (...arguments_) => System.systemDataUsage(...arguments_).pipe(provideAgent()),
            systemEvents: (...arguments_) => System.systemEvents(...arguments_).pipe(provideAgent()),
            systemInfo: (...arguments_) => System.systemInfo(...arguments_).pipe(provideAgent()),
            systemPing: (...arguments_) => System.systemPing(...arguments_).pipe(provideAgent()),
            systemPingHead: (...arguments_) => System.systemPingHead(...arguments_).pipe(provideAgent()),
            systemVersion: (...arguments_) => System.systemVersion(...arguments_).pipe(provideAgent()),
            taskInspect: (...arguments_) => Task.taskInspect(...arguments_).pipe(provideAgent()),
            taskList: (...arguments_) => Task.taskList(...arguments_).pipe(provideAgent()),
            taskLogs: (...arguments_) => Task.taskLogs(...arguments_).pipe(provideAgent()),
            volumeCreate: (...arguments_) => Volume.volumeCreate(...arguments_).pipe(provideAgent()),
            volumeDelete: (...arguments_) => Volume.volumeDelete(...arguments_).pipe(provideAgent()),
            volumeInspect: (...arguments_) => Volume.volumeInspect(...arguments_).pipe(provideAgent()),
            volumeList: (...arguments_) => Volume.volumeList(...arguments_).pipe(provideAgent()),
            volumePrune: (...arguments_) => Volume.volumePrune(...arguments_).pipe(provideAgent()),
            volumeUpdate: (...arguments_) => Volume.volumeUpdate(...arguments_).pipe(provideAgent()),
        })
    );

    return [contextTag, layer];
};
