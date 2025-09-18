package main

import (
	"reflect"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/events"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/api/types/registry"
	"github.com/docker/docker/api/types/swarm"
	"github.com/docker/docker/api/types/swarm/runtime"
	"github.com/docker/docker/api/types/system"
	"github.com/docker/docker/api/types/volume"
	"github.com/docker/docker/pkg/archive"
	"github.com/docker/docker/pkg/jsonmessage"
)

func typeToKey(t reflect.Type) string {
	return t.String()
}

var typesToSkip = map[string]string{
	"Time.Time":       "Schema.DateFromString",
	"time.Time":       "Schema.DateFromString",
	"Time.time":       "Schema.DateFromString",
	"time.time":       "Schema.DateFromString",
	"network.Address": "MobySchemas.Address",
	"nat.PortBinding": "MobySchemas.PortBinding",
	"nat.PortMap":     "MobySchemas.PortMap",
	"nat.port":        "MobySchemas.Port",
}

var typesToDisambiguate = map[string]string{
	// Types renames
	// https://pkg.go.dev/github.com/docker/docker@v27+incompatible/api/types
	typeToKey(reflect.TypeOf(types.Version{})):     "SystemVersionResponse",
	typeToKey(reflect.TypeOf(container.Summary{})): "ContainerListResponseItem",

	// Archive renames
	typeToKey(reflect.TypeOf(archive.Change{})): "ContainerChange",

	// Events renames
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/events
	// String/enum types
	// typeToKey(reflect.TypeOf(events.Action{})):   "EventAction",
	typeToKey(reflect.TypeOf(events.Actor{})):   "EventActor",
	typeToKey(reflect.TypeOf(events.Message{})): "EventMessage",

	// Container renames
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container
	// string/enum types
	// typeToKey(reflect.TypeOf(container.CgroupSpec{})): "ContainerCgroupSpec",
	// typeToKey(reflect.TypeOf(container.CgroupnsMode{})): "ContainerCgroupnsMode",
	// typeToKey(reflect.TypeOf(container.ChangeType{})): "ContainerChangeType",
	// typeToKey(reflect.TypeOf(container.IpcMode{})): "ContainerIpcMode",
	// typeToKey(reflect.TypeOf(container.Isolation{})): "ContainerIsolation",
	// typeToKey(reflect.TypeOf(container.LogMode{})): "ContainerLogMode",
	// typeToKey(reflect.TypeOf(container.NetworkMode{})): "ContainerNetworkMode",
	// typeToKey(reflect.TypeOf(container.PidMode{})): "ContainerPidMode",
	// typeToKey(reflect.TypeOf(container.RestartPolicyMode{})): "ContainerRestartPolicyMode",
	// typeToKey(reflect.TypeOf(container.UTSMode{})): "ContainerUTSMode",
	// typeToKey(reflect.TypeOf(container.UsernsMode{})): "ContainerUsernsMode",
	// typeToKey(reflect.TypeOf(container.WaitCondition{})): "ContainerWaitCondition",
	typeToKey(reflect.TypeOf(container.AttachOptions{})):          "ContainerAttachOptions",
	typeToKey(reflect.TypeOf(container.CommitOptions{})):          "ContainerCommitOptions",
	typeToKey(reflect.TypeOf(container.CopyToContainerOptions{})): "ContainerCopyToContainerOptions",
	typeToKey(reflect.TypeOf(container.ListOptions{})):            "ContainerListOptions",
	typeToKey(reflect.TypeOf(container.LogsOptions{})):            "ContainerLogsOptions",
	typeToKey(reflect.TypeOf(container.ExecAttachOptions{})):      "ContainerExecAttachOptions",
	typeToKey(reflect.TypeOf(container.ExecOptions{})):            "ContainerExecOptions",
	typeToKey(reflect.TypeOf(container.ExecStartOptions{})):       "ContainerExecStartOptions",
	typeToKey(reflect.TypeOf(container.RemoveOptions{})):          "ContainerRemoveOptions",
	typeToKey(reflect.TypeOf(container.ResizeOptions{})):          "ContainerResizeOptions",
	typeToKey(reflect.TypeOf(container.StartOptions{})):           "ContainerStartOptions",
	typeToKey(reflect.TypeOf(container.StopOptions{})):            "ContainerStopOptions",
	typeToKey(reflect.TypeOf(container.BlkioStatEntry{})):         "ContainerBlkioStatEntry",
	typeToKey(reflect.TypeOf(container.BlkioStats{})):             "ContainerBlkioStats",
	typeToKey(reflect.TypeOf(container.CPUStats{})):               "ContainerCPUStats",
	typeToKey(reflect.TypeOf(container.CPUUsage{})):               "ContainerCPUUsage",
	typeToKey(reflect.TypeOf(container.Config{})):                 "ContainerConfig",
	typeToKey(reflect.TypeOf(container.TopResponse{})):            "ContainerTopResponse",
	typeToKey(reflect.TypeOf(container.UpdateResponse{})):         "ContainerUpdateResponse",
	typeToKey(reflect.TypeOf(container.CreateRequest{})):          "ContainerCreateRequest",
	typeToKey(reflect.TypeOf(container.CreateResponse{})):         "ContainerCreateResponse",
	typeToKey(reflect.TypeOf(container.DeviceMapping{})):          "ContainerDeviceMapping",
	typeToKey(reflect.TypeOf(container.DeviceRequest{})):          "ContainerDeviceRequest",
	typeToKey(reflect.TypeOf(container.ExecInspect{})):            "ContainerExecInspect",
	typeToKey(reflect.TypeOf(container.FilesystemChange{})):       "ContainerFilesystemChange",
	typeToKey(reflect.TypeOf(container.HealthConfig{})):           "ContainerHealthConfig",
	typeToKey(reflect.TypeOf(container.HostConfig{})):             "ContainerHostConfig",
	typeToKey(reflect.TypeOf(container.LogConfig{})):              "ContainerLogConfig",
	typeToKey(reflect.TypeOf(container.MemoryStats{})):            "ContainerMemoryStats",
	typeToKey(reflect.TypeOf(container.NetworkStats{})):           "ContainerNetworkStats",
	typeToKey(reflect.TypeOf(container.PathStat{})):               "ContainerPathStat",
	typeToKey(reflect.TypeOf(container.PidsStats{})):              "ContainerPidsStats",
	typeToKey(reflect.TypeOf(container.PruneReport{})):            "ContainerPruneResponse",
	typeToKey(reflect.TypeOf(container.Resources{})):              "ContainerResources",
	typeToKey(reflect.TypeOf(container.RestartPolicy{})):          "ContainerRestartPolicy",
	typeToKey(reflect.TypeOf(container.StatsResponse{})):          "ContainerStats",
	typeToKey(reflect.TypeOf(container.StatsResponse{})):          "ContainerStatsResponse",
	typeToKey(reflect.TypeOf(container.StorageStats{})):           "ContainerStorageStats",
	typeToKey(reflect.TypeOf(container.ThrottlingData{})):         "ContainerThrottlingData",
	typeToKey(reflect.TypeOf(container.Ulimit{})):                 "ContainerUlimit",
	typeToKey(reflect.TypeOf(container.UpdateConfig{})):           "ContainerUpdateConfig",
	typeToKey(reflect.TypeOf(container.WaitExitError{})):          "ContainerWaitExitError",
	typeToKey(reflect.TypeOf(container.WaitResponse{})):           "ContainerWaitResponse",
	typeToKey(reflect.TypeOf(container.InspectResponse{})):        "ContainerInspectResponse",

	// Image renames
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image
	typeToKey(reflect.TypeOf(image.CreateOptions{})):       "ImageCreateOptions",
	typeToKey(reflect.TypeOf(image.ImportOptions{})):       "ImageImportOptions",
	typeToKey(reflect.TypeOf(image.ImportSource{})):        "ImageImportSource",
	typeToKey(reflect.TypeOf(image.PullOptions{})):         "ImagePullOptions",
	typeToKey(reflect.TypeOf(image.PushOptions{})):         "ImagePushOptions",
	typeToKey(reflect.TypeOf(image.RemoveOptions{})):       "ImageRemoveOptions",
	typeToKey(reflect.TypeOf(image.ListOptions{})):         "ImageListOptions",
	typeToKey(reflect.TypeOf(image.DeleteResponse{})):      "ImageDeleteResponse",
	typeToKey(reflect.TypeOf(image.HistoryResponseItem{})): "ImageHistoryResponseItem",
	typeToKey(reflect.TypeOf(image.LoadResponse{})):        "ImageLoadResponse",
	typeToKey(reflect.TypeOf(image.Metadata{})):            "ImageMetadata",
	typeToKey(reflect.TypeOf(image.PruneReport{})):         "ImagePruneResponse",
	typeToKey(reflect.TypeOf(image.Summary{})):             "ImageSummary",
	typeToKey(reflect.TypeOf(image.InspectResponse{})):     "ImageInspectResponse",

	// Registry renames
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/registry
	typeToKey(reflect.TypeOf(registry.SearchResult{})):        "RegistrySearchResponse",
	typeToKey(reflect.TypeOf(registry.SearchResults{})):       "RegistryImageSearchResponse",
	typeToKey(reflect.TypeOf(registry.AuthConfig{})):          "RegistryAuthConfig",
	typeToKey(reflect.TypeOf(registry.AuthenticateOKBody{})):  "RegistryAuthenticateOKBody",
	typeToKey(reflect.TypeOf(registry.DistributionInspect{})): "RegistryDistributionInspect",
	typeToKey(reflect.TypeOf(registry.IndexInfo{})):           "RegistryIndexInfo",
	typeToKey(reflect.TypeOf(registry.ServiceConfig{})):       "RegistryServiceConfig",

	// Network renames
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network
	typeToKey(reflect.TypeOf(network.Address{})):            "NetworkAddress",
	typeToKey(reflect.TypeOf(network.ConfigReference{})):    "NetworkConfigReference",
	typeToKey(reflect.TypeOf(network.ConnectOptions{})):     "NetworkConnectOptions",
	typeToKey(reflect.TypeOf(network.CreateOptions{})):      "NetworkCreateOptions",
	typeToKey(reflect.TypeOf(network.CreateRequest{})):      "NetworkCreateRequest",
	typeToKey(reflect.TypeOf(network.CreateResponse{})):     "NetworkCreateResponse",
	typeToKey(reflect.TypeOf(network.DisconnectOptions{})):  "NetworkDisconnectOptions",
	typeToKey(reflect.TypeOf(network.EndpointIPAMConfig{})): "NetworkEndpointIPAMConfig",
	typeToKey(reflect.TypeOf(network.EndpointResource{})):   "NetworkEndpointResource",
	typeToKey(reflect.TypeOf(network.EndpointSettings{})):   "NetworkEndpointSettings",
	typeToKey(reflect.TypeOf(network.IPAM{})):               "NetworkIPAM",
	typeToKey(reflect.TypeOf(network.IPAMConfig{})):         "NetworkIPAMConfig",
	typeToKey(reflect.TypeOf(network.Inspect{})):            "NetworkInspect",
	typeToKey(reflect.TypeOf(network.InspectOptions{})):     "NetworkInspectOptions",
	typeToKey(reflect.TypeOf(network.ListOptions{})):        "NetworkListOptions",
	typeToKey(reflect.TypeOf(network.NetworkingConfig{})):   "NetworkNetworkingConfig",
	typeToKey(reflect.TypeOf(network.PeerInfo{})):           "NetworkPeerInfo",
	typeToKey(reflect.TypeOf(network.PruneReport{})):        "NetworkPruneResponse",
	typeToKey(reflect.TypeOf(network.ServiceInfo{})):        "NetworkServiceInfo",
	typeToKey(reflect.TypeOf(network.Summary{})):            "NetworkSummary",
	typeToKey(reflect.TypeOf(network.Task{})):               "NetworkTask",

	// Swarm renames
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm
	// typeToKey(reflect.TypeOf(swarm.AppArmorMode{})): "SwarmAppArmorMode",
	// typeToKey(reflect.TypeOf(swarm.ExternalCAProtocol{})): "SwarmExternalCAProtocol",
	// typeToKey(reflect.TypeOf(swarm.LocalNodeState{})): "SwarmLocalNodeState",
	// typeToKey(reflect.TypeOf(swarm.NodeAvailability{})): "SwarmNodeAvailability",
	// typeToKey(reflect.TypeOf(swarm.NodeRole{})): "SwarmNodeRole",
	// typeToKey(reflect.TypeOf(swarm.NodeState{})): "SwarmNodeState",
	// typeToKey(reflect.TypeOf(swarm.PortConfigProtocol{})): "SwarmPortConfigProtocol",
	// typeToKey(reflect.TypeOf(swarm.PortConfigPublishMode{})): "SwarmPortConfigPublishMode",
	// typeToKey(reflect.TypeOf(swarm.ResolutionMode{})): "SwarmResolutionMode",
	// typeToKey(reflect.TypeOf(swarm.RestartPolicyCondition{})): "SwarmRestartPolicyCondition",
	// typeToKey(reflect.TypeOf(swarm.RuntimeType{})): "SwarmRuntimeType",
	// typeToKey(reflect.TypeOf(swarm.RuntimeURL{})): "SwarmRuntimeURL",
	// typeToKey(reflect.TypeOf(swarm.SeccompMode{})): "SwarmSeccompMode",
	// typeToKey(reflect.TypeOf(swarm.TaskState{})): "SwarmTaskState",
	// typeToKey(reflect.TypeOf(swarm.UpdateState{})): "SwarmUpdateState",
	// typeToKey(reflect.TypeOf(swarm.Reachability{})): "SwarmReachability",
	typeToKey(reflect.TypeOf(swarm.Annotations{})):                  "SwarmAnnotations",
	typeToKey(reflect.TypeOf(swarm.AppArmorOpts{})):                 "SwarmAppArmorOpts",
	typeToKey(reflect.TypeOf(swarm.CAConfig{})):                     "SwarmCAConfig",
	typeToKey(reflect.TypeOf(swarm.ClusterInfo{})):                  "SwarmClusterInfo",
	typeToKey(reflect.TypeOf(swarm.Config{})):                       "SwarmConfig",
	typeToKey(reflect.TypeOf(swarm.ConfigReference{})):              "SwarmConfigReference",
	typeToKey(reflect.TypeOf(swarm.ConfigReferenceFileTarget{})):    "SwarmConfigReferenceFileTarget",
	typeToKey(reflect.TypeOf(swarm.ConfigReferenceRuntimeTarget{})): "SwarmConfigReferenceRuntimeTarget",
	typeToKey(reflect.TypeOf(swarm.ConfigSpec{})):                   "SwarmConfigSpec",
	typeToKey(reflect.TypeOf(swarm.ContainerSpec{})):                "SwarmContainerSpec",
	typeToKey(reflect.TypeOf(swarm.ContainerStatus{})):              "SwarmContainerStatus",
	typeToKey(reflect.TypeOf(swarm.CredentialSpec{})):               "SwarmCredentialSpec",
	typeToKey(reflect.TypeOf(swarm.DNSConfig{})):                    "SwarmDNSConfig",
	typeToKey(reflect.TypeOf(swarm.DiscreteGenericResource{})):      "SwarmDiscreteGenericResource",
	typeToKey(reflect.TypeOf(swarm.DispatcherConfig{})):             "SwarmDispatcherConfig",
	typeToKey(reflect.TypeOf(swarm.Driver{})):                       "SwarmDriver",
	typeToKey(reflect.TypeOf(swarm.EncryptionConfig{})):             "SwarmEncryptionConfig",
	typeToKey(reflect.TypeOf(swarm.Endpoint{})):                     "SwarmEndpoint",
	typeToKey(reflect.TypeOf(swarm.EndpointSpec{})):                 "SwarmEndpointSpec",
	typeToKey(reflect.TypeOf(swarm.EndpointVirtualIP{})):            "SwarmEndpointVirtualIP",
	typeToKey(reflect.TypeOf(swarm.EngineDescription{})):            "SwarmEngineDescription",
	typeToKey(reflect.TypeOf(swarm.ExternalCA{})):                   "SwarmExternalCA",
	typeToKey(reflect.TypeOf(swarm.GenericResource{})):              "SwarmGenericResource",
	typeToKey(reflect.TypeOf(swarm.GlobalJob{})):                    "SwarmGlobalJob",
	typeToKey(reflect.TypeOf(swarm.GlobalService{})):                "SwarmGlobalService",
	typeToKey(reflect.TypeOf(swarm.IPAMConfig{})):                   "SwarmIPAMConfig",
	typeToKey(reflect.TypeOf(swarm.IPAMOptions{})):                  "SwarmIPAMOptions",
	typeToKey(reflect.TypeOf(swarm.Info{})):                         "SwarmInfo",
	typeToKey(reflect.TypeOf(swarm.InitRequest{})):                  "SwarmInitRequest",
	typeToKey(reflect.TypeOf(swarm.JobStatus{})):                    "SwarmJobStatus",
	typeToKey(reflect.TypeOf(swarm.JoinRequest{})):                  "SwarmJoinRequest",
	typeToKey(reflect.TypeOf(swarm.JoinTokens{})):                   "SwarmJoinTokens",
	typeToKey(reflect.TypeOf(swarm.Limit{})):                        "SwarmLimit",
	typeToKey(reflect.TypeOf(swarm.ManagerStatus{})):                "SwarmManagerStatus",
	typeToKey(reflect.TypeOf(swarm.Meta{})):                         "SwarmMeta",
	typeToKey(reflect.TypeOf(swarm.NamedGenericResource{})):         "SwarmNamedGenericResource",
	typeToKey(reflect.TypeOf(swarm.Network{})):                      "SwarmNetwork",
	typeToKey(reflect.TypeOf(swarm.NetworkAttachment{})):            "SwarmNetworkAttachment",
	typeToKey(reflect.TypeOf(swarm.NetworkAttachmentConfig{})):      "SwarmNetworkAttachmentConfig",
	typeToKey(reflect.TypeOf(swarm.NetworkAttachmentSpec{})):        "SwarmNetworkAttachmentSpec",
	typeToKey(reflect.TypeOf(swarm.NetworkSpec{})):                  "SwarmNetworkSpec",
	typeToKey(reflect.TypeOf(swarm.Node{})):                         "SwarmNode",
	typeToKey(reflect.TypeOf(swarm.NodeCSIInfo{})):                  "SwarmNodeCSIInfo",
	typeToKey(reflect.TypeOf(swarm.NodeDescription{})):              "SwarmNodeDescription",
	typeToKey(reflect.TypeOf(swarm.NodeSpec{})):                     "SwarmNodeSpec",
	typeToKey(reflect.TypeOf(swarm.NodeStatus{})):                   "SwarmNodeStatus",
	typeToKey(reflect.TypeOf(swarm.OrchestrationConfig{})):          "SwarmOrchestrationConfig",
	typeToKey(reflect.TypeOf(swarm.Peer{})):                         "SwarmPeer",
	typeToKey(reflect.TypeOf(swarm.Placement{})):                    "SwarmPlacement",
	typeToKey(reflect.TypeOf(swarm.PlacementPreference{})):          "SwarmPlacementPreference",
	typeToKey(reflect.TypeOf(swarm.Platform{})):                     "SwarmPlatform",
	typeToKey(reflect.TypeOf(swarm.PluginDescription{})):            "SwarmPluginDescription",
	typeToKey(reflect.TypeOf(swarm.PortConfig{})):                   "SwarmPortConfig",
	typeToKey(reflect.TypeOf(swarm.PortStatus{})):                   "SwarmPortStatus",
	typeToKey(reflect.TypeOf(swarm.Privileges{})):                   "SwarmPrivileges",
	typeToKey(reflect.TypeOf(swarm.RaftConfig{})):                   "SwarmRaftConfig",
	typeToKey(reflect.TypeOf(swarm.ReplicatedJob{})):                "SwarmReplicatedJob",
	typeToKey(reflect.TypeOf(swarm.ReplicatedService{})):            "SwarmReplicatedService",
	typeToKey(reflect.TypeOf(swarm.ResourceRequirements{})):         "SwarmResourceRequirements",
	typeToKey(reflect.TypeOf(swarm.Resources{})):                    "SwarmResources",
	typeToKey(reflect.TypeOf(swarm.RestartPolicy{})):                "SwarmRestartPolicy",
	typeToKey(reflect.TypeOf(swarm.SELinuxContext{})):               "SwarmSELinuxContext",
	typeToKey(reflect.TypeOf(swarm.SeccompOpts{})):                  "SwarmSeccompOpts",
	typeToKey(reflect.TypeOf(swarm.Secret{})):                       "SwarmSecret",
	typeToKey(reflect.TypeOf(swarm.SecretReference{})):              "SwarmSecretReference",
	typeToKey(reflect.TypeOf(swarm.SecretReferenceFileTarget{})):    "SwarmSecretReferenceFileTarget",
	typeToKey(reflect.TypeOf(swarm.SecretSpec{})):                   "SwarmSecretSpec",
	typeToKey(reflect.TypeOf(swarm.Service{})):                      "SwarmService",
	typeToKey(reflect.TypeOf(swarm.ServiceCreateResponse{})):        "SwarmServiceCreateResponse",
	typeToKey(reflect.TypeOf(swarm.ServiceMode{})):                  "SwarmServiceMode",
	typeToKey(reflect.TypeOf(swarm.ServiceSpec{})):                  "SwarmServiceSpec",
	typeToKey(reflect.TypeOf(swarm.ServiceStatus{})):                "SwarmServiceStatus",
	typeToKey(reflect.TypeOf(swarm.ServiceUpdateResponse{})):        "SwarmServiceUpdateResponse",
	typeToKey(reflect.TypeOf(swarm.Spec{})):                         "SwarmSpec",
	typeToKey(reflect.TypeOf(swarm.SpreadOver{})):                   "SwarmSpreadOver",
	typeToKey(reflect.TypeOf(swarm.Status{})):                       "SwarmStatus",
	typeToKey(reflect.TypeOf(swarm.Swarm{})):                        "Swarm",
	typeToKey(reflect.TypeOf(swarm.TLSInfo{})):                      "SwarmTLSInfo",
	typeToKey(reflect.TypeOf(swarm.Task{})):                         "SwarmTask",
	typeToKey(reflect.TypeOf(swarm.TaskDefaults{})):                 "SwarmTaskDefaults",
	typeToKey(reflect.TypeOf(swarm.TaskSpec{})):                     "SwarmTaskSpec",
	typeToKey(reflect.TypeOf(swarm.TaskStatus{})):                   "SwarmTaskStatus",
	typeToKey(reflect.TypeOf(swarm.Topology{})):                     "SwarmTopology",
	typeToKey(reflect.TypeOf(swarm.UnlockRequest{})):                "SwarmUnlockRequest",
	typeToKey(reflect.TypeOf(swarm.UpdateConfig{})):                 "SwarmUpdateConfig",
	typeToKey(reflect.TypeOf(swarm.UpdateFlags{})):                  "SwarmUpdateFlags",
	typeToKey(reflect.TypeOf(swarm.UpdateStatus{})):                 "SwarmUpdateStatus",
	typeToKey(reflect.TypeOf(swarm.Version{})):                      "SwarmVersion",
	typeToKey(reflect.TypeOf(swarm.VolumeAttachment{})):             "SwarmVolumeAttachment",

	// System renames
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/system
	typeToKey(reflect.TypeOf(system.Commit{})):               "SystemCommit",
	typeToKey(reflect.TypeOf(system.ContainerdInfo{})):       "SystemContainerdInfo",
	typeToKey(reflect.TypeOf(system.ContainerdNamespaces{})): "SystemContainerdNamespaces",
	typeToKey(reflect.TypeOf(system.Info{})):                 "SystemInfoResponse",
	typeToKey(reflect.TypeOf(system.KeyValue{})):             "SystemKeyValue",
	typeToKey(reflect.TypeOf(system.NetworkAddressPool{})):   "SystemNetworkAddressPool",
	typeToKey(reflect.TypeOf(system.PluginsInfo{})):          "SystemPluginsInfo",
	typeToKey(reflect.TypeOf(system.Runtime{})):              "SystemRuntime",
	typeToKey(reflect.TypeOf(system.RuntimeWithStatus{})):    "SystemRuntimeWithStatus",
	typeToKey(reflect.TypeOf(system.SecurityOpt{})):          "SystemSecurityOpt",

	// Volumes rename
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume
	// typeToKey(reflect.TypeOf(volume.Availability{})): "VolumeAvailability",
	// typeToKey(reflect.TypeOf(volume.PublishState{})): "VolumePublishState",
	// typeToKey(reflect.TypeOf(volume.Scope{})): "VolumeScope",
	// typeToKey(reflect.TypeOf(volume.SharingMode{})): "VolumeSharingMode",
	// typeToKey(reflect.TypeOf(volume.ListOptions{})): "VolumeListOptions",
	typeToKey(reflect.TypeOf(volume.AccessMode{})):          "VolumeAccessMode",
	typeToKey(reflect.TypeOf(volume.CapacityRange{})):       "VolumeCapacityRange",
	typeToKey(reflect.TypeOf(volume.ClusterVolume{})):       "ClusterVolume",
	typeToKey(reflect.TypeOf(volume.ClusterVolumeSpec{})):   "ClusterVolumeSpec",
	typeToKey(reflect.TypeOf(volume.CreateOptions{})):       "VolumeCreateOptions",
	typeToKey(reflect.TypeOf(volume.Info{})):                "VolumeInfo",
	typeToKey(reflect.TypeOf(volume.ListResponse{})):        "VolumeListResponse",
	typeToKey(reflect.TypeOf(volume.PruneReport{})):         "VolumePruneResponse",
	typeToKey(reflect.TypeOf(volume.PublishStatus{})):       "VolumePublishStatus",
	typeToKey(reflect.TypeOf(volume.Secret{})):              "VolumeSecret",
	typeToKey(reflect.TypeOf(volume.Topology{})):            "VolumeTopology",
	typeToKey(reflect.TypeOf(volume.TopologyRequirement{})): "VolumeTopologyRequirement",
	typeToKey(reflect.TypeOf(volume.TypeBlock{})):           "VolumeTypeBlock",
	typeToKey(reflect.TypeOf(volume.TypeMount{})):           "VolumeTypeMount",
	typeToKey(reflect.TypeOf(volume.UpdateOptions{})):       "VolumeUpdateOptions",
	typeToKey(reflect.TypeOf(volume.UsageData{})):           "VolumeUsageData",
	typeToKey(reflect.TypeOf(volume.Volume{})):              "Volume",
}

var dockerTypesToReflect2 = []reflect.Type{
	reflect.TypeOf(container.Health{}),
}

var dockerTypesToReflect = []reflect.Type{
	// Configs API
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/server/router/swarm
	// GetConfigs(opts types.ConfigListOptions) ([]swarm.Config, error)
	// CreateConfig(s swarm.ConfigSpec) (string, error)
	// RemoveConfig(id string) error
	// GetConfig(id string) (swarm.Config, error)
	// UpdateConfig(idOrName string, version uint64, spec swarm.ConfigSpec) error
	reflect.TypeOf(swarm.Config{}),
	reflect.TypeOf(swarm.ConfigSpec{}),

	// Containers API
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/server/router/container
	// ContainerExecCreate(name string, options *container.ExecOptions) (string, error)
	// ContainerExecInspect(id string) (*backend.ExecInspect, error)
	// ContainerExecResize(ctx context.Context, name string, height, width uint32) error
	// ContainerExecStart(ctx context.Context, name string, options backend.ExecStartConfig) error
	// ContainerArchivePath(name string, path string) (content io.ReadCloser, stat *container.PathStat, err error)
	// ContainerExport(ctx context.Context, name string, out io.Writer) error
	// ContainerExtractToDir(name, path string, copyUIDGID, noOverwriteDirNonDir bool, content io.Reader) error
	// ContainerStatPath(name string, path string) (stat *container.PathStat, err error)
	// ContainerCreate(ctx context.Context, config backend.ContainerCreateConfig) (container.CreateResponse, error)
	// ContainerKill(name string, signal string) error
	// ContainerPause(name string) error
	// ContainerRename(oldName, newName string) error
	// ContainerResize(ctx context.Context, name string, height, width uint32) error
	// ContainerRestart(ctx context.Context, name string, options container.StopOptions) error
	// ContainerRm(name string, config *backend.ContainerRmConfig) error
	// ContainerStart(ctx context.Context, name string, checkpoint string, checkpointDir string) error
	// ContainerStop(ctx context.Context, name string, options container.StopOptions) error
	// ContainerUnpause(name string) error
	// ContainerUpdate(name string, hostConfig *container.HostConfig) (container.UpdateResponse, error)
	// ContainerWait(ctx context.Context, name string, condition container.WaitCondition) (<-chan container.StateStatus, error)
	// ContainerChanges(ctx context.Context, name string) ([]archive.Change, error)
	// ContainerInspect(ctx context.Context, name string, options backend.ContainerInspectOptions) (*container.InspectResponse, error)
	// ContainerLogs(ctx context.Context, name string, config *container.LogsOptions) (msgs <-chan *backend.LogMessage, tty bool, err error)
	// ContainerStats(ctx context.Context, name string, config *backend.ContainerStatsConfig) error
	// ContainerTop(name string, psArgs string) (*container.TopResponse, error)
	// Containers(ctx context.Context, config *container.ListOptions) ([]*container.Summary, error)
	// ContainerAttach(name string, c *backend.ContainerAttachConfig) error
	// ContainersPrune(ctx context.Context, pruneFilters filters.Args) (*container.PruneReport, error)
	// CreateImageFromContainer(ctx context.Context, name string, config *backend.CreateImageConfig) (imageID string, err error)
	reflect.TypeOf(container.ExecOptions{}),
	reflect.TypeOf(container.ExecInspect{}),
	reflect.TypeOf(container.PathStat{}),
	reflect.TypeOf(container.CreateRequest{}),
	reflect.TypeOf(container.CreateResponse{}),
	reflect.TypeOf(container.HostConfig{}),
	reflect.TypeOf(container.StopOptions{}),
	reflect.TypeOf(container.UpdateResponse{}),
	reflect.TypeOf(container.LogsOptions{}),
	reflect.TypeOf(container.TopResponse{}),
	reflect.TypeOf(container.PruneReport{}),
	reflect.TypeOf(container.StatsResponse{}),
	reflect.TypeOf(container.WaitResponse{}),
	reflect.TypeOf(container.Summary{}),
	reflect.TypeOf(archive.Change{}),
	reflect.TypeOf(container.ExecInspect{}),
	reflect.TypeOf(jsonmessage.JSONMessage{}),
	reflect.TypeOf(container.InspectResponse{}),

	// Distribution API
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/server/router/distribution
	// GetRepositories(context.Context, reference.Named, *registry.AuthConfig) ([]distribution.Repository, error)
	reflect.TypeOf(registry.DistributionInspect{}),

	// Images API
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/server/router/image
	// ImageDelete(ctx context.Context, imageRef string, options image.RemoveOptions) ([]image.DeleteResponse, error)
	// ImageHistory(ctx context.Context, imageName string, platform *ocispec.Platform) ([]*image.HistoryResponseItem, error)
	// Images(ctx context.Context, opts image.ListOptions) ([]*image.Summary, error)
	// GetImage(ctx context.Context, refOrID string, options backend.GetImageOpts) (*dockerimage.Image, error)
	// ImageInspect(ctx context.Context, refOrID string, options backend.ImageInspectOpts) (*image.InspectResponse, error)
	// TagImage(ctx context.Context, id dockerimage.ID, newRef reference.Named) error
	// ImagesPrune(ctx context.Context, pruneFilters filters.Args) (*image.PruneReport, error)
	// LoadImage(ctx context.Context, inTar io.ReadCloser, platform *ocispec.Platform, outStream io.Writer, quiet bool) error
	// ImportImage(ctx context.Context, ref reference.Named, platform *ocispec.Platform, msg string, layerReader io.Reader, changes []string) (dockerimage.ID, error)
	// ExportImage(ctx context.Context, names []string, platform *ocispec.Platform, outStream io.Writer) error
	// PullImage(ctx context.Context, ref reference.Named, platform *ocispec.Platform, metaHeaders map[string][]string, authConfig *registry.AuthConfig, outStream io.Writer) error
	// PushImage(ctx context.Context, ref reference.Named, platform *ocispec.Platform, metaHeaders map[string][]string, authConfig *registry.AuthConfig, outStream io.Writer) error
	reflect.TypeOf(registry.SearchResult{}),
	reflect.TypeOf(image.DeleteResponse{}),
	reflect.TypeOf(image.HistoryResponseItem{}),
	reflect.TypeOf(image.LoadResponse{}),
	reflect.TypeOf(image.Metadata{}),
	reflect.TypeOf(image.Summary{}),
	reflect.TypeOf(image.InspectResponse{}),

	// Networks API
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/server/router/network
	// GetNetworks(filters.Args, backend.NetworkListConfig) ([]network.Inspect, error)
	// CreateNetwork(ctx context.Context, nc network.CreateRequest) (*network.CreateResponse, error)
	// ConnectContainerToNetwork(ctx context.Context, containerName, networkName string, endpointConfig *network.EndpointSettings) error
	// DisconnectContainerFromNetwork(containerName string, networkName string, force bool) error
	// DeleteNetwork(networkID string) error
	// NetworksPrune(ctx context.Context, pruneFilters filters.Args) (*network.PruneReport, error)
	reflect.TypeOf(network.Inspect{}),
	reflect.TypeOf(network.CreateRequest{}),
	reflect.TypeOf(network.EndpointSettings{}),
	reflect.TypeOf(network.ConnectOptions{}),

	// Nodes API
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/server/router/swarm
	// GetNodes(swarm.NodeListOptions) ([]swarm.Node, error)
	// GetNode(string) (swarm.Node, error)
	// UpdateNode(string, uint64, swarm.NodeSpec) error
	// RemoveNode(string, bool) error
	reflect.TypeOf(swarm.Node{}),
	reflect.TypeOf(swarm.NodeSpec{}),

	// Plugins API
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/server/router/plugin
	// Disable(name string, config *backend.PluginDisableConfig) error
	// Enable(name string, config *backend.PluginEnableConfig) error
	// List(filters.Args) ([]types.Plugin, error)
	// Inspect(name string) (*types.Plugin, error)
	// Remove(name string, config *backend.PluginRmConfig) error
	// Set(name string, args []string) error
	// Privileges(ctx context.Context, ref reference.Named, metaHeaders http.Header, authConfig *registry.AuthConfig) (types.PluginPrivileges, error)
	// Pull(ctx context.Context, ref reference.Named, name string, metaHeaders http.Header, authConfig *registry.AuthConfig, privileges types.PluginPrivileges, outStream io.Writer, opts ...plugin.CreateOpt) error
	// Push(ctx context.Context, name string, metaHeaders http.Header, authConfig *registry.AuthConfig, outStream io.Writer) error
	// Upgrade(ctx context.Context, ref reference.Named, name string, metaHeaders http.Header, authConfig *registry.AuthConfig, privileges types.PluginPrivileges, outStream io.Writer) error
	// CreateFromContext(ctx context.Context, tarCtx io.ReadCloser, options *types.PluginCreateOptions) error
	reflect.TypeOf(runtime.PluginPrivilege{}),
	reflect.TypeOf(types.Plugin{}),

	// Secrets API
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/server/router/swarm
	// GetSecrets(opts swarm.SecretListOptions) ([]swarm.Secret, error)
	// CreateSecret(s swarm.SecretSpec) (string, error)
	// RemoveSecret(idOrName string) error
	// GetSecret(id string) (swarm.Secret, error)
	// UpdateSecret(idOrName string, version uint64, spec swarm.SecretSpec) error
	reflect.TypeOf(swarm.Secret{}),
	reflect.TypeOf(swarm.SecretSpec{}),

	// Services API
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/server/router/swarm
	// GetServices(swarm.ServiceListOptions) ([]swarm.Service, error)
	// GetService(idOrName string, insertDefaults bool) (swarm.Service, error)
	// CreateService(swarm.ServiceSpec, string, bool) (*swarm.ServiceCreateResponse, error)
	// UpdateService(string, uint64, swarm.ServiceSpec, swarm.ServiceUpdateOptions, bool) (*swarm.ServiceUpdateResponse, error)
	// RemoveService(string) error
	// ServiceLogs(context.Context, *backend.LogSelector, *container.LogsOptions) (<-chan *backend.LogMessage, error)
	reflect.TypeOf(swarm.Service{}),
	reflect.TypeOf(swarm.ServiceSpec{}),

	// Swarm API
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/server/router/swarm
	// Init(req swarm.InitRequest) (string, error)
	// Join(req swarm.JoinRequest) error
	// Leave(ctx context.Context, force bool) error
	// Inspect() (swarm.Swarm, error)
	// Update(uint64, swarm.Spec, swarm.UpdateFlags) error
	// GetUnlockKey() (string, error)
	// UnlockSwarm(req swarm.UnlockRequest) error
	reflect.TypeOf(swarm.InitRequest{}),
	reflect.TypeOf(swarm.JoinRequest{}),
	reflect.TypeOf(swarm.Swarm{}),
	reflect.TypeOf(swarm.Spec{}),
	reflect.TypeOf(swarm.UnlockRequest{}),

	// System API
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/server/router/system
	// SystemInfo(context.Context) (*system.Info, error)
	// SystemVersion(context.Context) (types.Version, error)
	// SystemDiskUsage(ctx context.Context, opts backend.DiskUsageOptions) (*backend.DiskUsage, error)
	// SubscribeToEvents(since, until time.Time, ef filters.Args) ([]events.Message, chan interface{})
	// AuthenticateToRegistry(ctx context.Context, authConfig *registry.AuthConfig) (string, string, error)
	reflect.TypeOf(system.Info{}),
	reflect.TypeOf(types.Version{}),
	reflect.TypeOf(types.DiskUsage{}),
	reflect.TypeOf(events.Message{}),
	reflect.TypeOf(registry.AuthConfig{}),
	reflect.TypeOf(registry.AuthenticateOKBody{}),

	// Tasks API
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/server/router/swarm
	// GetTasks(swarm.TaskListOptions) ([]swarm.Task, error)
	// GetTask(string) (swarm.Task, error)
	reflect.TypeOf(swarm.Task{}),

	// Volumes API
	// https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/server/router/volume
	// List(ctx context.Context, filter filters.Args) ([]*volume.Volume, []string, error)
	// Get(ctx context.Context, name string, opts ...opts.GetOption) (*volume.Volume, error)
	// Create(ctx context.Context, name, driverName string, opts ...opts.CreateOption) (*volume.Volume, error)
	// Remove(ctx context.Context, name string, opts ...opts.RemoveOption) error
	// Prune(ctx context.Context, pruneFilters filters.Args) (*volume.PruneReport, error)
	reflect.TypeOf(volume.Volume{}),
	reflect.TypeOf(volume.ListResponse{}),
	reflect.TypeOf(volume.CreateOptions{}),
	reflect.TypeOf(volume.PruneReport{}),
}
