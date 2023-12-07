import http from "node:http";
import https from "node:https";

import * as NodeHttp from "@effect/platform-node/HttpClient";
import { Context, Data, Effect, Layer, Match, Scope, pipe } from "effect";
import * as ssh2 from "ssh2";

import { IMobyConnectionAgent, MobyConnectionAgent } from "./request-helpers.js";

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

export type MobyConnectionOptions =
    | { protocol: "http"; host: string; port: number }
    | { protocol: "https"; host: string; port: number; cert: string; ca: string; key: string }
    | ({ protocol: "ssh" } & ssh2.ConnectConfig)
    | { protocol: "unix"; socketPath: string };

export interface IMobyService {
    readonly configCreate: Config.configCreateWithConnectionAgentProvided;
    readonly configDelete: Config.configDeleteWithConnectionAgentProvided;
    readonly configInspect: Config.configInspectWithConnectionAgentProvided;
    readonly configList: Config.configListWithConnectionAgentProvided;
    readonly configUpdate: Config.configUpdateWithConnectionAgentProvided;
    readonly containerArchive: Container.containerArchiveWithConnectionAgentProvided;
    readonly containerArchiveInfo: Container.containerArchiveInfoWithConnectionAgentProvided;
    readonly containerAttach: Container.containerAttachWithConnectionAgentProvided;
    readonly containerAttachWebsocket: Container.containerAttachWebsocketWithConnectionAgentProvided;
    readonly containerChanges: Container.containerChangesWithConnectionAgentProvided;
    readonly containerCreate: Container.containerCreateWithConnectionAgentProvided;
    readonly containerDelete: Container.containerDeleteWithConnectionAgentProvided;
    readonly containerExport: Container.containerExportWithConnectionAgentProvided;
    readonly containerInspect: Container.containerInspectWithConnectionAgentProvided;
    readonly containerKill: Container.containerKillWithConnectionAgentProvided;
    readonly containerList: Container.containerListWithConnectionAgentProvided;
    readonly containerLogs: Container.containerLogsWithConnectionAgentProvided;
    readonly containerPause: Container.containerPauseWithConnectionAgentProvided;
    readonly containerPrune: Container.containerPruneWithConnectionAgentProvided;
    readonly containerRename: Container.containerRenameWithConnectionAgentProvided;
    readonly containerResize: Container.containerResizeWithConnectionAgentProvided;
    readonly containerRestart: Container.containerRestartWithConnectionAgentProvided;
    readonly containerStart: Container.containerStartWithConnectionAgentProvided;
    readonly containerStats: Container.containerStatsWithConnectionAgentProvided;
    readonly containerStop: Container.containerStopWithConnectionAgentProvided;
    readonly containerTop: Container.containerTopWithConnectionAgentProvided;
    readonly containerUnpause: Container.containerUnpauseWithConnectionAgentProvided;
    readonly containerUpdate: Container.containerUpdateWithConnectionAgentProvided;
    readonly containerWait: Container.containerWaitWithConnectionAgentProvided;
    readonly putContainerArchive: Container.putContainerArchiveWithConnectionAgentProvided;
    readonly distributionInspect: Distribution.distributionInspectWithConnectionAgentProvided;
    readonly containerExec: Exec.containerExecWithConnectionAgentProvided;
    readonly execInspect: Exec.execInspectWithConnectionAgentProvided;
    readonly execResize: Exec.execResizeWithConnectionAgentProvided;
    readonly execStart: Exec.execStartWithConnectionAgentProvided;
    readonly buildPrune: Image.buildPruneWithConnectionAgentProvided;
    readonly imageBuild: Image.imageBuildWithConnectionAgentProvided;
    readonly imageCommit: Image.imageCommitWithConnectionAgentProvided;
    readonly imageCreate: Image.imageCreateWithConnectionAgentProvided;
    readonly imageDelete: Image.imageDeleteWithConnectionAgentProvided;
    readonly imageGet: Image.imageGetWithConnectionAgentProvided;
    readonly imageGetAll: Image.imageGetAllWithConnectionAgentProvided;
    readonly imageHistory: Image.imageHistoryWithConnectionAgentProvided;
    readonly imageInspect: Image.imageInspectWithConnectionAgentProvided;
    readonly imageList: Image.imageListWithConnectionAgentProvided;
    readonly imageLoad: Image.imageLoadWithConnectionAgentProvided;
    readonly imagePrune: Image.imagePruneWithConnectionAgentProvided;
    readonly imagePush: Image.imagePushWithConnectionAgentProvided;
    readonly imageSearch: Image.imageSearchWithConnectionAgentProvided;
    readonly imageTag: Image.imageTagWithConnectionAgentProvided;
    readonly networkConnect: Network.networkConnectWithConnectionAgentProvided;
    readonly networkCreate: Network.networkCreateWithConnectionAgentProvided;
    readonly networkDelete: Network.networkDeleteWithConnectionAgentProvided;
    readonly networkDisconnect: Network.networkDisconnectWithConnectionAgentProvided;
    readonly networkInspect: Network.networkInspectWithConnectionAgentProvided;
    readonly networkList: Network.networkListWithConnectionAgentProvided;
    readonly networkPrune: Network.networkPruneWithConnectionAgentProvided;
    readonly nodeDelete: Node.nodeDeleteWithConnectionAgentProvided;
    readonly nodeInspect: Node.nodeInspectWithConnectionAgentProvided;
    readonly nodeList: Node.nodeListWithConnectionAgentProvided;
    readonly nodeUpdate: Node.nodeUpdateWithConnectionAgentProvided;
    readonly getPluginPrivileges: Plugin.getPluginPrivilegesWithConnectionAgentProvided;
    readonly pluginCreate: Plugin.pluginCreateWithConnectionAgentProvided;
    readonly pluginDelete: Plugin.pluginDeleteWithConnectionAgentProvided;
    readonly pluginDisable: Plugin.pluginDisableWithConnectionAgentProvided;
    readonly pluginEnable: Plugin.pluginEnableWithConnectionAgentProvided;
    readonly pluginInspect: Plugin.pluginInspectWithConnectionAgentProvided;
    readonly pluginList: Plugin.pluginListWithConnectionAgentProvided;
    readonly pluginPull: Plugin.pluginPullWithConnectionAgentProvided;
    readonly pluginPush: Plugin.pluginPushWithConnectionAgentProvided;
    readonly pluginSet: Plugin.pluginSetWithConnectionAgentProvided;
    readonly pluginUpgrade: Plugin.pluginUpgradeWithConnectionAgentProvided;
    readonly secretCreate: Secret.secretCreateWithConnectionAgentProvided;
    readonly secretDelete: Secret.secretDeleteWithConnectionAgentProvided;
    readonly secretInspect: Secret.secretInspectWithConnectionAgentProvided;
    readonly secretList: Secret.secretListWithConnectionAgentProvided;
    readonly secretUpdate: Secret.secretUpdateWithConnectionAgentProvided;
    readonly serviceCreate: Service.serviceCreateWithConnectionAgentProvided;
    readonly serviceDelete: Service.serviceDeleteWithConnectionAgentProvided;
    readonly serviceInspect: Service.serviceInspectWithConnectionAgentProvided;
    readonly serviceList: Service.serviceListWithConnectionAgentProvided;
    readonly serviceLogs: Service.serviceLogsWithConnectionAgentProvided;
    readonly serviceUpdate: Service.serviceUpdateWithConnectionAgentProvided;
    readonly session: Session.sessionWithConnectionAgentProvided;
    readonly swarmInit: Swarm.swarmInitWithConnectionAgentProvided;
    readonly swarmInspect: Swarm.swarmInspectWithConnectionAgentProvided;
    readonly swarmJoin: Swarm.swarmJoinWithConnectionAgentProvided;
    readonly swarmLeave: Swarm.swarmLeaveWithConnectionAgentProvided;
    readonly swarmUnlock: Swarm.swarmUnlockWithConnectionAgentProvided;
    readonly swarmUnlockkey: Swarm.swarmUnlockkeyWithConnectionAgentProvided;
    readonly swarmUpdate: Swarm.swarmUpdateWithConnectionAgentProvided;
    readonly systemAuth: System.systemAuthWithConnectionAgentProvided;
    readonly systemDataUsage: System.systemDataUsageWithConnectionAgentProvided;
    readonly systemEvents: System.systemEventsWithConnectionAgentProvided;
    readonly systemInfo: System.systemInfoWithConnectionAgentProvided;
    readonly systemPing: System.systemPingWithConnectionAgentProvided;
    readonly systemPingHead: System.systemPingHeadWithConnectionAgentProvided;
    readonly systemVersion: System.systemVersionWithConnectionAgentProvided;
    readonly taskInspect: Task.taskInspectWithConnectionAgentProvided;
    readonly taskList: Task.taskListWithConnectionAgentProvided;
    readonly taskLogs: Task.taskLogsWithConnectionAgentProvided;
    readonly volumeCreate: Volume.volumeCreateWithConnectionAgentProvided;
    readonly volumeDelete: Volume.volumeDeleteWithConnectionAgentProvided;
    readonly volumeInspect: Volume.volumeInspectWithConnectionAgentProvided;
    readonly volumeList: Volume.volumeListWithConnectionAgentProvided;
    readonly volumePrune: Volume.volumePruneWithConnectionAgentProvided;
    readonly volumeUpdate: Volume.volumeUpdateWithConnectionAgentProvided;
    readonly getAgent: Effect.Effect<Scope.Scope, never, NodeHttp.nodeClient.HttpAgent>;
}

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
    if (instantiatedClientTags.has(contextIdentifier)) {
        return [
            Context.Tag(),
            Layer.fail(new MobyClientAlreadyInstantiated({ message: "Client already instantiated" })),
        ];
    }

    const localMobyConnectionOptions: MobyConnectionOptions =
        mobyConnectionOptions ||
        ({
            protocol: "unix",
            socketPath: "/var/run/docker.sock",
        } as MobyConnectionOptions);

    const agentOptions: http.AgentOptions | https.AgentOptions = pipe(
        Match.value<MobyConnectionOptions>(localMobyConnectionOptions),
        Match.when({ protocol: "unix" }, (options) => ({ socketPath: options.socketPath })),
        Match.orElse((options) => ({ host: options.host, port: options.port }))
    ) as http.AgentOptions | https.AgentOptions;

    const getAgent: Effect.Effect<Scope.Scope, never, IMobyConnectionAgent> = NodeHttp.nodeClient
        .makeAgent(agentOptions)
        .pipe(Effect.map((_) => ({ ..._, _: 69 })));

    const contextTag: Context.Tag<ContextIdentifier, IMobyService> = Context.Tag<ContextIdentifier, IMobyService>();

    const layer: Layer.Layer<never, never, ContextIdentifier> = Layer.succeed(
        contextTag,
        contextTag.of({
            configCreate: (...arguments_) =>
                Config.configCreate(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            configDelete: (...arguments_) =>
                Config.configDelete(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            configInspect: (...arguments_) =>
                Config.configInspect(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            configList: (...arguments_) =>
                Config.configList(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            configUpdate: (...arguments_) =>
                Config.configUpdate(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            containerArchive: (...arguments_) =>
                Container.containerArchive(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerArchiveInfo: (...arguments_) =>
                Container.containerArchiveInfo(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerAttach: (...arguments_) =>
                Container.containerAttach(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerAttachWebsocket: (...arguments_) =>
                Container.containerAttachWebsocket(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerChanges: (...arguments_) =>
                Container.containerChanges(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerCreate: (...arguments_) =>
                Container.containerCreate(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerDelete: (...arguments_) =>
                Container.containerDelete(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerExport: (...arguments_) =>
                Container.containerExport(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerInspect: (...arguments_) =>
                Container.containerInspect(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerKill: (...arguments_) =>
                Container.containerKill(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            containerList: (...arguments_) =>
                Container.containerList(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            containerLogs: (...arguments_) =>
                Container.containerLogs(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            containerPause: (...arguments_) =>
                Container.containerPause(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerPrune: (...arguments_) =>
                Container.containerPrune(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerRename: (...arguments_) =>
                Container.containerRename(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerResize: (...arguments_) =>
                Container.containerResize(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerRestart: (...arguments_) =>
                Container.containerRestart(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerStart: (...arguments_) =>
                Container.containerStart(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerStats: (...arguments_) =>
                Container.containerStats(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerStop: (...arguments_) =>
                Container.containerStop(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            containerTop: (...arguments_) =>
                Container.containerTop(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            containerUnpause: (...arguments_) =>
                Container.containerUnpause(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerUpdate: (...arguments_) =>
                Container.containerUpdate(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerWait: (...arguments_) =>
                Container.containerWait(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            putContainerArchive: (...arguments_) =>
                Container.putContainerArchive(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            distributionInspect: (...arguments_) =>
                Distribution.distributionInspect(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            containerExec: (...arguments_) =>
                Exec.containerExec(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            execInspect: (...arguments_) =>
                Exec.execInspect(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            execResize: (...arguments_) =>
                Exec.execResize(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            execStart: (...arguments_) =>
                Exec.execStart(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            buildPrune: (...arguments_) =>
                Image.buildPrune(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            imageBuild: (...arguments_) =>
                Image.imageBuild(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            imageCommit: (...arguments_) =>
                Image.imageCommit(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            imageCreate: (...arguments_) =>
                Image.imageCreate(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            imageDelete: (...arguments_) =>
                Image.imageDelete(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            imageGet: (...arguments_) =>
                Image.imageGet(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            imageGetAll: (...arguments_) =>
                Image.imageGetAll(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            imageHistory: (...arguments_) =>
                Image.imageHistory(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            imageInspect: (...arguments_) =>
                Image.imageInspect(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            imageList: (...arguments_) =>
                Image.imageList(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            imageLoad: (...arguments_) =>
                Image.imageLoad(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            imagePrune: (...arguments_) =>
                Image.imagePrune(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            imagePush: (...arguments_) =>
                Image.imagePush(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            imageSearch: (...arguments_) =>
                Image.imageSearch(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            imageTag: (...arguments_) =>
                Image.imageTag(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            networkConnect: (...arguments_) =>
                Network.networkConnect(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            networkCreate: (...arguments_) =>
                Network.networkCreate(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            networkDelete: (...arguments_) =>
                Network.networkDelete(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            networkDisconnect: (...arguments_) =>
                Network.networkDisconnect(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            networkInspect: (...arguments_) =>
                Network.networkInspect(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            networkList: (...arguments_) =>
                Network.networkList(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            networkPrune: (...arguments_) =>
                Network.networkPrune(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            nodeDelete: (...arguments_) =>
                Node.nodeDelete(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            nodeInspect: (...arguments_) =>
                Node.nodeInspect(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            nodeList: (...arguments_) =>
                Node.nodeList(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            nodeUpdate: (...arguments_) =>
                Node.nodeUpdate(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            getPluginPrivileges: (...arguments_) =>
                Plugin.getPluginPrivileges(...arguments_).pipe(
                    Effect.provideServiceEffect(MobyConnectionAgent, getAgent)
                ),
            pluginCreate: (...arguments_) =>
                Plugin.pluginCreate(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            pluginDelete: (...arguments_) =>
                Plugin.pluginDelete(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            pluginDisable: (...arguments_) =>
                Plugin.pluginDisable(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            pluginEnable: (...arguments_) =>
                Plugin.pluginEnable(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            pluginInspect: (...arguments_) =>
                Plugin.pluginInspect(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            pluginList: (...arguments_) =>
                Plugin.pluginList(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            pluginPull: (...arguments_) =>
                Plugin.pluginPull(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            pluginPush: (...arguments_) =>
                Plugin.pluginPush(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            pluginSet: (...arguments_) =>
                Plugin.pluginSet(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            pluginUpgrade: (...arguments_) =>
                Plugin.pluginUpgrade(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            secretCreate: (...arguments_) =>
                Secret.secretCreate(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            secretDelete: (...arguments_) =>
                Secret.secretDelete(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            secretInspect: (...arguments_) =>
                Secret.secretInspect(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            secretList: (...arguments_) =>
                Secret.secretList(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            secretUpdate: (...arguments_) =>
                Secret.secretUpdate(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            serviceCreate: (...arguments_) =>
                Service.serviceCreate(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            serviceDelete: (...arguments_) =>
                Service.serviceDelete(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            serviceInspect: (...arguments_) =>
                Service.serviceInspect(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            serviceList: (...arguments_) =>
                Service.serviceList(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            serviceLogs: (...arguments_) =>
                Service.serviceLogs(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            serviceUpdate: (...arguments_) =>
                Service.serviceUpdate(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            session: (...arguments_) =>
                Session.session(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            swarmInit: (...arguments_) =>
                Swarm.swarmInit(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            swarmInspect: (...arguments_) =>
                Swarm.swarmInspect(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            swarmJoin: (...arguments_) =>
                Swarm.swarmJoin(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            swarmLeave: (...arguments_) =>
                Swarm.swarmLeave(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            swarmUnlock: (...arguments_) =>
                Swarm.swarmUnlock(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            swarmUnlockkey: (...arguments_) =>
                Swarm.swarmUnlockkey(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            swarmUpdate: (...arguments_) =>
                Swarm.swarmUpdate(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            systemAuth: (...arguments_) =>
                System.systemAuth(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            systemDataUsage: (...arguments_) =>
                System.systemDataUsage(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            systemEvents: (...arguments_) =>
                System.systemEvents(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            systemInfo: (...arguments_) =>
                System.systemInfo(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            systemPing: (...arguments_) =>
                System.systemPing(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            systemPingHead: (...arguments_) =>
                System.systemPingHead(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            systemVersion: (...arguments_) =>
                System.systemVersion(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            taskInspect: (...arguments_) =>
                Task.taskInspect(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            taskList: (...arguments_) =>
                Task.taskList(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            taskLogs: (...arguments_) =>
                Task.taskLogs(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            volumeCreate: (...arguments_) =>
                Volume.volumeCreate(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            volumeDelete: (...arguments_) =>
                Volume.volumeDelete(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            volumeInspect: (...arguments_) =>
                Volume.volumeInspect(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            volumeList: (...arguments_) =>
                Volume.volumeList(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            volumePrune: (...arguments_) =>
                Volume.volumePrune(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            volumeUpdate: (...arguments_) =>
                Volume.volumeUpdate(...arguments_).pipe(Effect.provideServiceEffect(MobyConnectionAgent, getAgent)),
            getAgent,
        })
    );

    return [contextTag, layer];
};
