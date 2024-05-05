---
title: Schemas.ts
nav_order: 15
parent: Modules
---

## Schemas overview

Moby Schemas

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Address (class)](#address-class)
  - [AuthConfig (class)](#authconfig-class)
  - [BuildCache (class)](#buildcache-class)
  - [BuildInfo (class)](#buildinfo-class)
  - [BuildPruneResponse (class)](#buildpruneresponse-class)
  - [ClusterInfo (class)](#clusterinfo-class)
  - [ClusterVolume (class)](#clustervolume-class)
  - [ClusterVolumeSpec (class)](#clustervolumespec-class)
  - [Commit (class)](#commit-class)
  - [Config (class)](#config-class)
  - [ConfigSpec (class)](#configspec-class)
  - [ContainerConfig (class)](#containerconfig-class)
  - [ContainerCreateResponse (class)](#containercreateresponse-class)
  - [ContainerCreateSpec (class)](#containercreatespec-class)
  - [ContainerInspectResponse (class)](#containerinspectresponse-class)
  - [ContainerPruneResponse (class)](#containerpruneresponse-class)
  - [ContainerState (class)](#containerstate-class)
  - [ContainerStatus (class)](#containerstatus-class)
  - [ContainerSummary (class)](#containersummary-class)
  - [ContainerTopResponse (class)](#containertopresponse-class)
  - [ContainerUpdateResponse (class)](#containerupdateresponse-class)
  - [ContainerUpdateSpec (class)](#containerupdatespec-class)
  - [ContainerWaitExitError (class)](#containerwaitexiterror-class)
  - [ContainerWaitResponse (class)](#containerwaitresponse-class)
  - [CreateImageInfo (class)](#createimageinfo-class)
  - [DeviceMapping (class)](#devicemapping-class)
  - [DeviceRequest (class)](#devicerequest-class)
  - [DistributionInspect (class)](#distributioninspect-class)
  - [Driver (class)](#driver-class)
  - [EndpointIPAMConfig (class)](#endpointipamconfig-class)
  - [EndpointPortConfig (class)](#endpointportconfig-class)
  - [EndpointSettings (class)](#endpointsettings-class)
  - [EndpointSpec (class)](#endpointspec-class)
  - [EngineDescription (class)](#enginedescription-class)
  - [ErrorDetail (class)](#errordetail-class)
  - [ErrorResponse (class)](#errorresponse-class)
  - [EventActor (class)](#eventactor-class)
  - [EventMessage (class)](#eventmessage-class)
  - [ExecConfig (class)](#execconfig-class)
  - [ExecInspectResponse (class)](#execinspectresponse-class)
  - [ExecStartConfig (class)](#execstartconfig-class)
  - [FilesystemChange (class)](#filesystemchange-class)
  - [GenericResources](#genericresources)
  - [GraphDriverData (class)](#graphdriverdata-class)
  - [Health (class)](#health-class)
  - [HealthConfig (class)](#healthconfig-class)
  - [HealthcheckResult (class)](#healthcheckresult-class)
  - [HistoryResponseItem (class)](#historyresponseitem-class)
  - [HostConfig (class)](#hostconfig-class)
  - [IDResponse (class)](#idresponse-class)
  - [IPAM (class)](#ipam-class)
  - [IPAMConfig (class)](#ipamconfig-class)
  - [IdResponse (class)](#idresponse-class-1)
  - [ImageDeleteResponseItem (class)](#imagedeleteresponseitem-class)
  - [ImageID (class)](#imageid-class)
  - [ImageInspect (class)](#imageinspect-class)
  - [ImagePruneResponse (class)](#imagepruneresponse-class)
  - [ImageSearchResponseItem (class)](#imagesearchresponseitem-class)
  - [ImageSummary (class)](#imagesummary-class)
  - [IndexInfo (class)](#indexinfo-class)
  - [JoinTokens (class)](#jointokens-class)
  - [Limit (class)](#limit-class)
  - [ManagerStatus (class)](#managerstatus-class)
  - [Mount (class)](#mount-class)
  - [MountPoint (class)](#mountpoint-class)
  - [Network (class)](#network-class)
  - [NetworkAttachmentConfig (class)](#networkattachmentconfig-class)
  - [NetworkConnectRequest (class)](#networkconnectrequest-class)
  - [NetworkContainer (class)](#networkcontainer-class)
  - [NetworkCreateRequest (class)](#networkcreaterequest-class)
  - [NetworkCreateResponse (class)](#networkcreateresponse-class)
  - [NetworkDisconnectRequest (class)](#networkdisconnectrequest-class)
  - [NetworkPruneResponse (class)](#networkpruneresponse-class)
  - [NetworkSettings (class)](#networksettings-class)
  - [NetworkingConfig (class)](#networkingconfig-class)
  - [Node (class)](#node-class)
  - [NodeDescription (class)](#nodedescription-class)
  - [NodeSpec (class)](#nodespec-class)
  - [NodeStatus (class)](#nodestatus-class)
  - [OCIDescriptor (class)](#ocidescriptor-class)
  - [OCIPlatform (class)](#ociplatform-class)
  - [PeerNode (class)](#peernode-class)
  - [Platform (class)](#platform-class)
  - [Plugin (class)](#plugin-class)
  - [PluginDevice (class)](#plugindevice-class)
  - [PluginEnvironment (class)](#pluginenvironment-class)
  - [PluginInterfaceType (class)](#plugininterfacetype-class)
  - [PluginMount (class)](#pluginmount-class)
  - [PluginPrivilege (class)](#pluginprivilege-class)
  - [PluginsInfo (class)](#pluginsinfo-class)
  - [Port (class)](#port-class)
  - [PortBinding (class)](#portbinding-class)
  - [PortStatus (class)](#portstatus-class)
  - [ProcessConfig (class)](#processconfig-class)
  - [ProgressDetail (class)](#progressdetail-class)
  - [PushImageInfo (class)](#pushimageinfo-class)
  - [RegistryServiceConfig (class)](#registryserviceconfig-class)
  - [ResourceObject (class)](#resourceobject-class)
  - [Resources (class)](#resources-class)
  - [RestartPolicy (class)](#restartpolicy-class)
  - [Runtime (class)](#runtime-class)
  - [Secret (class)](#secret-class)
  - [SecretSpec (class)](#secretspec-class)
  - [Service (class)](#service-class)
  - [ServiceCreateResponse (class)](#servicecreateresponse-class)
  - [ServiceSpec (class)](#servicespec-class)
  - [ServiceUpdateResponse (class)](#serviceupdateresponse-class)
  - [Swarm (class)](#swarm-class)
  - [SwarmInfo (class)](#swarminfo-class)
  - [SwarmInitRequest (class)](#swarminitrequest-class)
  - [SwarmJoinRequest (class)](#swarmjoinrequest-class)
  - [SwarmSpec (class)](#swarmspec-class)
  - [SwarmUnlockRequest (class)](#swarmunlockrequest-class)
  - [SystemAuthResponse (class)](#systemauthresponse-class)
  - [SystemDataUsageResponse (class)](#systemdatausageresponse-class)
  - [SystemInfo (class)](#systeminfo-class)
  - [SystemVersion (class)](#systemversion-class)
  - [TLSInfo (class)](#tlsinfo-class)
  - [Task (class)](#task-class)
  - [TaskSpec (class)](#taskspec-class)
  - [TaskStatus (class)](#taskstatus-class)
  - [ThrottleDevice (class)](#throttledevice-class)
  - [UnlockKeyResponse (class)](#unlockkeyresponse-class)
  - [Volume (class)](#volume-class)
  - [VolumeCreateOptions (class)](#volumecreateoptions-class)
  - [VolumeListResponse (class)](#volumelistresponse-class)
  - [VolumePruneResponse (class)](#volumepruneresponse-class)

---

# utils

## Address (class)

Address represents an IPv4 or IPv6 IP address.

**Signature**

```ts
export declare class Address
```

Added in v1.45.0

## AuthConfig (class)

**Signature**

```ts
export declare class AuthConfig
```

Added in v1.45.0

## BuildCache (class)

BuildCache contains information about a build cache record.

**Signature**

```ts
export declare class BuildCache
```

Added in v1.45.0

## BuildInfo (class)

**Signature**

```ts
export declare class BuildInfo
```

Added in v1.45.0

## BuildPruneResponse (class)

**Signature**

```ts
export declare class BuildPruneResponse
```

Added in v1.45.0

## ClusterInfo (class)

**Signature**

```ts
export declare class ClusterInfo
```

## ClusterVolume (class)

**Signature**

```ts
export declare class ClusterVolume
```

Added in v1.45.0

## ClusterVolumeSpec (class)

**Signature**

```ts
export declare class ClusterVolumeSpec
```

Added in v1.45.0

## Commit (class)

**Signature**

```ts
export declare class Commit
```

Added in v1.45.0

## Config (class)

**Signature**

```ts
export declare class Config
```

Added in v1.45.0

## ConfigSpec (class)

**Signature**

```ts
export declare class ConfigSpec
```

Added in v1.45.0

## ContainerConfig (class)

**Signature**

```ts
export declare class ContainerConfig
```

Added in v1.45.0

## ContainerCreateResponse (class)

**Signature**

```ts
export declare class ContainerCreateResponse
```

Added in v1.45.0

## ContainerCreateSpec (class)

**Signature**

```ts
export declare class ContainerCreateSpec
```

Added in v1.45.0

## ContainerInspectResponse (class)

**Signature**

```ts
export declare class ContainerInspectResponse
```

Added in v1.45.0

## ContainerPruneResponse (class)

**Signature**

```ts
export declare class ContainerPruneResponse
```

## ContainerState (class)

**Signature**

```ts
export declare class ContainerState
```

## ContainerStatus (class)

**Signature**

```ts
export declare class ContainerStatus
```

Added in v1.45.0

## ContainerSummary (class)

**Signature**

```ts
export declare class ContainerSummary
```

Added in v1.45.0

## ContainerTopResponse (class)

**Signature**

```ts
export declare class ContainerTopResponse
```

Added in v1.45.0

## ContainerUpdateResponse (class)

**Signature**

```ts
export declare class ContainerUpdateResponse
```

Added in v1.45.0

## ContainerUpdateSpec (class)

**Signature**

```ts
export declare class ContainerUpdateSpec
```

Added in v1.45.0

## ContainerWaitExitError (class)

**Signature**

```ts
export declare class ContainerWaitExitError
```

Added in v1.45.0

## ContainerWaitResponse (class)

**Signature**

```ts
export declare class ContainerWaitResponse
```

Added in v1.45.0

## CreateImageInfo (class)

**Signature**

```ts
export declare class CreateImageInfo
```

Added in v1.45.0

## DeviceMapping (class)

A device mapping between the host and container.

**Signature**

```ts
export declare class DeviceMapping
```

Added in v1.45.0

## DeviceRequest (class)

A request for devices to be sent to device drivers.

**Signature**

```ts
export declare class DeviceRequest
```

Added in v1.45.0

## DistributionInspect (class)

**Signature**

```ts
export declare class DistributionInspect
```

Added in v1.45.0

## Driver (class)

**Signature**

```ts
export declare class Driver
```

Added in v1.45.0

## EndpointIPAMConfig (class)

**Signature**

```ts
export declare class EndpointIPAMConfig
```

## EndpointPortConfig (class)

**Signature**

```ts
export declare class EndpointPortConfig
```

Added in v1.45.0

## EndpointSettings (class)

**Signature**

```ts
export declare class EndpointSettings
```

Added in v1.45.0

## EndpointSpec (class)

**Signature**

```ts
export declare class EndpointSpec
```

Added in v1.45.0

## EngineDescription (class)

**Signature**

```ts
export declare class EngineDescription
```

Added in v1.45.0

## ErrorDetail (class)

**Signature**

```ts
export declare class ErrorDetail
```

Added in v1.45.0

## ErrorResponse (class)

**Signature**

```ts
export declare class ErrorResponse
```

Added in v1.45.0

## EventActor (class)

**Signature**

```ts
export declare class EventActor
```

Added in v1.45.0

## EventMessage (class)

**Signature**

```ts
export declare class EventMessage
```

Added in v1.45.0

## ExecConfig (class)

**Signature**

```ts
export declare class ExecConfig
```

Added in v1.45.0

## ExecInspectResponse (class)

**Signature**

```ts
export declare class ExecInspectResponse
```

Added in v1.45.0

## ExecStartConfig (class)

**Signature**

```ts
export declare class ExecStartConfig
```

Added in v1.45.0

## FilesystemChange (class)

**Signature**

```ts
export declare class FilesystemChange
```

Added in v1.45.0

## GenericResources

User-defined resources can be either Integer resources (e.g, `SSD=3`) or
string resources (e.g, `GPU=UUID1`).

TODO: What should the top level be wrapped in?

**Signature**

```ts
export declare const GenericResources: Schema.Schema<
  readonly {
    readonly NamedResourceSpec?: { readonly Kind?: string | undefined; readonly Value?: string | undefined } | undefined
    readonly DiscreteResourceSpec?:
      | { readonly Kind?: string | undefined; readonly Value?: number | undefined }
      | undefined
  }[],
  readonly {
    readonly NamedResourceSpec?: { readonly Kind?: string | undefined; readonly Value?: string | undefined } | undefined
    readonly DiscreteResourceSpec?:
      | { readonly Kind?: string | undefined; readonly Value?: number | undefined }
      | undefined
  }[],
  never
>
```

Added in v1.45.0

## GraphDriverData (class)

Information about the storage driver used to store the container's and
image's filesystem.

**Signature**

```ts
export declare class GraphDriverData
```

Added in v1.45.0

## Health (class)

**Signature**

```ts
export declare class Health
```

## HealthConfig (class)

A test to perform to check that the container is healthy.

**Signature**

```ts
export declare class HealthConfig
```

Added in v1.45.0

## HealthcheckResult (class)

HealthcheckResult stores information about a single run of a healthcheck
probe. TODO: marked as x-nullable at the top level, what does that mean for
consumers?

**Signature**

```ts
export declare class HealthcheckResult
```

Added in v1.45.0

## HistoryResponseItem (class)

**Signature**

```ts
export declare class HistoryResponseItem
```

Added in v1.45.0

## HostConfig (class)

**Signature**

```ts
export declare class HostConfig
```

Added in v1.45.0

## IDResponse (class)

**Signature**

```ts
export declare class IDResponse
```

Added in v1.45.0

## IPAM (class)

**Signature**

```ts
export declare class IPAM
```

Added in v1.45.0

## IPAMConfig (class)

**Signature**

```ts
export declare class IPAMConfig
```

Added in v1.45.0

## IdResponse (class)

**Signature**

```ts
export declare class IdResponse
```

Added in v1.45.0

## ImageDeleteResponseItem (class)

**Signature**

```ts
export declare class ImageDeleteResponseItem
```

Added in v1.45.0

## ImageID (class)

Image ID or Digest

**Signature**

```ts
export declare class ImageID
```

Added in v1.45.0

## ImageInspect (class)

**Signature**

```ts
export declare class ImageInspect
```

Added in v1.45.0

## ImagePruneResponse (class)

**Signature**

```ts
export declare class ImagePruneResponse
```

Added in v1.45.0

## ImageSearchResponseItem (class)

**Signature**

```ts
export declare class ImageSearchResponseItem
```

Added in v1.45.0

## ImageSummary (class)

**Signature**

```ts
export declare class ImageSummary
```

Added in v1.45.0

## IndexInfo (class)

**Signature**

```ts
export declare class IndexInfo
```

## JoinTokens (class)

JoinTokens contains the tokens workers and managers need to join the swarm.

**Signature**

```ts
export declare class JoinTokens
```

Added in v1.45.0

## Limit (class)

An object describing a limit on resources which can be requested by a task.

**Signature**

```ts
export declare class Limit
```

Added in v1.45.0

## ManagerStatus (class)

**Signature**

```ts
export declare class ManagerStatus
```

## Mount (class)

**Signature**

```ts
export declare class Mount
```

Added in v1.45.0

## MountPoint (class)

MountPoint represents a mount point configuration inside the container. This
is used for reporting the mountpoints in use by a container.

**Signature**

```ts
export declare class MountPoint
```

Added in v1.45.0

## Network (class)

**Signature**

```ts
export declare class Network
```

Added in v1.45.0

## NetworkAttachmentConfig (class)

**Signature**

```ts
export declare class NetworkAttachmentConfig
```

Added in v1.45.0

## NetworkConnectRequest (class)

**Signature**

```ts
export declare class NetworkConnectRequest
```

Added in v1.45.0

## NetworkContainer (class)

**Signature**

```ts
export declare class NetworkContainer
```

Added in v1.45.0

## NetworkCreateRequest (class)

**Signature**

```ts
export declare class NetworkCreateRequest
```

Added in v1.45.0

## NetworkCreateResponse (class)

**Signature**

```ts
export declare class NetworkCreateResponse
```

Added in v1.45.0

## NetworkDisconnectRequest (class)

**Signature**

```ts
export declare class NetworkDisconnectRequest
```

Added in v1.45.0

## NetworkPruneResponse (class)

**Signature**

```ts
export declare class NetworkPruneResponse
```

Added in v1.45.0

## NetworkSettings (class)

**Signature**

```ts
export declare class NetworkSettings
```

Added in v1.45.0

## NetworkingConfig (class)

**Signature**

```ts
export declare class NetworkingConfig
```

Added in v1.45.0

## Node (class)

**Signature**

```ts
export declare class Node
```

Added in v1.45.0

## NodeDescription (class)

**Signature**

```ts
export declare class NodeDescription
```

Added in v1.45.0

## NodeSpec (class)

**Signature**

```ts
export declare class NodeSpec
```

Added in v1.45.0

## NodeStatus (class)

**Signature**

```ts
export declare class NodeStatus
```

Added in v1.45.0

## OCIDescriptor (class)

**Signature**

```ts
export declare class OCIDescriptor
```

Added in v1.45.0

## OCIPlatform (class)

**Signature**

```ts
export declare class OCIPlatform
```

Added in v1.45.0

## PeerNode (class)

**Signature**

```ts
export declare class PeerNode
```

Added in v1.45.0

## Platform (class)

**Signature**

```ts
export declare class Platform
```

Added in v1.45.0

## Plugin (class)

**Signature**

```ts
export declare class Plugin
```

Added in v1.45.0

## PluginDevice (class)

**Signature**

```ts
export declare class PluginDevice
```

Added in v1.45.0

## PluginEnvironment (class)

**Signature**

```ts
export declare class PluginEnvironment
```

Added in v1.45.0

## PluginInterfaceType (class)

**Signature**

```ts
export declare class PluginInterfaceType
```

Added in v1.45.0

## PluginMount (class)

**Signature**

```ts
export declare class PluginMount
```

Added in v1.45.0

## PluginPrivilege (class)

**Signature**

```ts
export declare class PluginPrivilege
```

Added in v1.45.0

## PluginsInfo (class)

**Signature**

```ts
export declare class PluginsInfo
```

Added in v1.45.0

## Port (class)

**Signature**

```ts
export declare class Port
```

## PortBinding (class)

PortBinding represents a binding between a host IP address and a host port.

**Signature**

```ts
export declare class PortBinding
```

Added in v1.45.0

## PortStatus (class)

**Signature**

```ts
export declare class PortStatus
```

Added in v1.45.0

## ProcessConfig (class)

**Signature**

```ts
export declare class ProcessConfig
```

Added in v1.45.0

## ProgressDetail (class)

**Signature**

```ts
export declare class ProgressDetail
```

Added in v1.45.0

## PushImageInfo (class)

**Signature**

```ts
export declare class PushImageInfo
```

Added in v1.45.0

## RegistryServiceConfig (class)

**Signature**

```ts
export declare class RegistryServiceConfig
```

## ResourceObject (class)

**Signature**

```ts
export declare class ResourceObject
```

Added in v1.45.0

## Resources (class)

**Signature**

```ts
export declare class Resources
```

Added in v1.45.0

## RestartPolicy (class)

The behavior to apply when the container exits. The default is not to
restart. An ever increasing delay (double the previous delay, starting at
100ms) is added before each restart to prevent flooding the server.

**Signature**

```ts
export declare class RestartPolicy
```

Added in v1.45.0

## Runtime (class)

**Signature**

```ts
export declare class Runtime
```

Added in v1.45.0

## Secret (class)

**Signature**

```ts
export declare class Secret
```

Added in v1.45.0

## SecretSpec (class)

**Signature**

```ts
export declare class SecretSpec
```

Added in v1.45.0

## Service (class)

**Signature**

```ts
export declare class Service
```

Added in v1.45.0

## ServiceCreateResponse (class)

**Signature**

```ts
export declare class ServiceCreateResponse
```

Added in v1.45.0

## ServiceSpec (class)

**Signature**

```ts
export declare class ServiceSpec
```

Added in v1.45.0

## ServiceUpdateResponse (class)

**Signature**

```ts
export declare class ServiceUpdateResponse
```

Added in v1.45.0

## Swarm (class)

**Signature**

```ts
export declare class Swarm
```

Added in v1.45.0

## SwarmInfo (class)

**Signature**

```ts
export declare class SwarmInfo
```

Added in v1.45.0

## SwarmInitRequest (class)

**Signature**

```ts
export declare class SwarmInitRequest
```

Added in v1.45.0

## SwarmJoinRequest (class)

**Signature**

```ts
export declare class SwarmJoinRequest
```

Added in v1.45.0

## SwarmSpec (class)

**Signature**

```ts
export declare class SwarmSpec
```

Added in v1.45.0

## SwarmUnlockRequest (class)

**Signature**

```ts
export declare class SwarmUnlockRequest
```

Added in v1.45.0

## SystemAuthResponse (class)

**Signature**

```ts
export declare class SystemAuthResponse
```

Added in v1.45.0

## SystemDataUsageResponse (class)

**Signature**

```ts
export declare class SystemDataUsageResponse
```

Added in v1.45.0

## SystemInfo (class)

**Signature**

```ts
export declare class SystemInfo
```

Added in v1.45.0

## SystemVersion (class)

**Signature**

```ts
export declare class SystemVersion
```

Added in v1.45.0

## TLSInfo (class)

Information about the issuer of leaf TLS certificates and the trusted root CA
certificate

**Signature**

```ts
export declare class TLSInfo
```

Added in v1.45.0

## Task (class)

**Signature**

```ts
export declare class Task
```

Added in v1.45.0

## TaskSpec (class)

**Signature**

```ts
export declare class TaskSpec
```

Added in v1.45.0

## TaskStatus (class)

**Signature**

```ts
export declare class TaskStatus
```

Added in v1.45.0

## ThrottleDevice (class)

**Signature**

```ts
export declare class ThrottleDevice
```

Added in v1.45.0

## UnlockKeyResponse (class)

**Signature**

```ts
export declare class UnlockKeyResponse
```

Added in v1.45.0

## Volume (class)

**Signature**

```ts
export declare class Volume
```

Added in v1.45.0

## VolumeCreateOptions (class)

**Signature**

```ts
export declare class VolumeCreateOptions
```

Added in v1.45.0

## VolumeListResponse (class)

**Signature**

```ts
export declare class VolumeListResponse
```

Added in v1.45.0

## VolumePruneResponse (class)

**Signature**

```ts
export declare class VolumePruneResponse
```

Added in v1.45.0
