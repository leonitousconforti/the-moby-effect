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
	"github.com/docker/docker/api/types/volume"
)

func typeToKey(t reflect.Type) string {
	return t.String()
}

var typesToDisambiguate = map[string]string{
	// github.com/docker/docker/api/types/events renames
	typeToKey(reflect.TypeOf(events.Actor{})):   "EventActor",
	typeToKey(reflect.TypeOf(events.Message{})): "EventMessage",

	// github.com/docker/docker/api/types/container renames
	typeToKey(reflect.TypeOf(container.Config{})):            "ContainerConfig",
	typeToKey(reflect.TypeOf(container.CreateResponse{})):    "ContainerCreateResponse",
	typeToKey(reflect.TypeOf(container.DeviceMapping{})):     "ContainerDeviceMapping",
	typeToKey(reflect.TypeOf(container.DeviceRequest{})):     "ContainerDeviceRequest",
	typeToKey(reflect.TypeOf(container.ExecStartOptions{})):  "ContainerExecStartOptions",
	typeToKey(reflect.TypeOf(container.FilesystemChange{})):  "ContainerFilesystemChange",
	typeToKey(reflect.TypeOf(container.HealthConfig{})):      "ContainerHealthConfig",
	typeToKey(reflect.TypeOf(container.HostConfig{})):        "ContainerHostConfig",
	typeToKey(reflect.TypeOf(container.LogConfig{})):         "ContainerLogConfig",
	typeToKey(reflect.TypeOf(container.Resources{})):         "ContainerResources",
	typeToKey(reflect.TypeOf(container.RestartPolicy{})):     "ContainerRestartPolicy",
	typeToKey(reflect.TypeOf(container.StopOptions{})):       "ContainerStopOptions",
	typeToKey(reflect.TypeOf(container.UpdateConfig{})):      "ContainerUpdateConfig",
	typeToKey(reflect.TypeOf(container.WaitExitError{})):     "ContainerWaitExitError",
	typeToKey(reflect.TypeOf(container.WaitResponse{})):      "ContainerWaitResponse",
	typeToKey(reflect.TypeOf(types.Container{})):             "ContainerListResponse",
	typeToKey(reflect.TypeOf(types.ContainerExecInspect{})):  "ContainerExecInspectResponse",
	typeToKey(reflect.TypeOf(types.ContainerJSON{})):         "ContainerInspectResponse",
	typeToKey(reflect.TypeOf(types.ContainerPathStat{})):     "ContainerPathStatResponse",
	typeToKey(reflect.TypeOf(types.ContainersPruneReport{})): "ContainersPruneResponse",
	typeToKey(reflect.TypeOf(types.StatsJSON{})):             "ContainerStatsResponse",

	// Registry renames
	typeToKey(reflect.TypeOf(registry.SearchResult{})):         "RegistrySearchResponse",
	typeToKey(reflect.TypeOf(registry.SearchResults{})):        "RegistryImageSearchResponse",
	typeToKey(reflect.TypeOf(registry.AuthConfig{})):           "RegistryAuthConfig",
	typeToKey(reflect.TypeOf(registry.AuthenticateOKBody{})):   "RegistryAuthenticateOKBody",
	typeToKey(reflect.TypeOf(registry.DistributionInspect{})):  "RegistryDistributionInspect",
	typeToKey(reflect.TypeOf(registry.IndexInfo{})):            "RegistryIndexInfo",
	typeToKey(reflect.TypeOf(registry.ServiceConfig{})):        "RegistryServiceConfig",
	typeToKey(reflect.TypeOf(image.HistoryResponseItem{})):     "ImageHistoryResponseItem",
	typeToKey(reflect.TypeOf(image.GetImageOpts{})):            "ImageGetOptions",
	typeToKey(reflect.TypeOf(types.ImageDeleteResponseItem{})): "ImageDeleteResponse",
	typeToKey(reflect.TypeOf(types.ImageInspect{})):            "ImageInspectResponse",
	typeToKey(reflect.TypeOf(types.ImageLoadResponse{})):       "ImagesLoadResponse",
	typeToKey(reflect.TypeOf(types.ImagesPruneReport{})):       "ImagesPruneResponse",
	typeToKey(reflect.TypeOf(types.ImageSummary{})):            "ImagesListResponse",

	// Network renames
	typeToKey(reflect.TypeOf(network.Task{})):                "NetworkTask",
	typeToKey(reflect.TypeOf(network.ConfigReference{})):     "NetworkConfigReference",
	typeToKey(reflect.TypeOf(network.Address{})):             "NetworkAddress",
	typeToKey(reflect.TypeOf(network.EndpointIPAMConfig{})):  "NetworkEndpointIPAMConfig",
	typeToKey(reflect.TypeOf(network.EndpointSettings{})):    "NetworkEndpointSettings",
	typeToKey(reflect.TypeOf(network.IPAM{})):                "NetworkIPAM",
	typeToKey(reflect.TypeOf(network.IPAMConfig{})):          "NetworkIPAMConfig",
	typeToKey(reflect.TypeOf(network.PeerInfo{})):            "NetworkPeerInfo",
	typeToKey(reflect.TypeOf(network.ServiceInfo{})):         "NetworkServiceInfo",
	typeToKey(reflect.TypeOf(types.NetworkConnect{})):        "NetworkConnectRequest",
	typeToKey(reflect.TypeOf(types.NetworkCreateRequest{})):  "NetworkCreateRequest",
	typeToKey(reflect.TypeOf(types.NetworkCreateResponse{})): "NetworkCreateResponse",
	typeToKey(reflect.TypeOf(types.NetworkDisconnect{})):     "NetworkDisconnectRequest",
	typeToKey(reflect.TypeOf(types.NetworksPruneReport{})):   "NetworkPruneResponse",
	typeToKey(reflect.TypeOf(types.NetworkResource{})):       "NetworkResponse",

	// Node renames
	typeToKey(reflect.TypeOf(swarm.Node{})):     "SwarmNode",
	typeToKey(reflect.TypeOf(swarm.NodeSpec{})): "SwarmNodeSpec",

	// Swarm renames
	typeToKey(reflect.TypeOf(swarm.Annotations{})):                  "SwarmAnnotations",
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
	typeToKey(reflect.TypeOf(swarm.Secret{})):                       "SwarmSecret",
	typeToKey(reflect.TypeOf(swarm.SecretReference{})):              "SwarmSecretReference",
	typeToKey(reflect.TypeOf(swarm.SecretReferenceFileTarget{})):    "SwarmSecretReferenceFileTarget",
	typeToKey(reflect.TypeOf(swarm.SecretSpec{})):                   "SwarmSecretSpec",
	typeToKey(reflect.TypeOf(swarm.Service{})):                      "SwarmService",
	typeToKey(reflect.TypeOf(swarm.ServiceMode{})):                  "SwarmServiceMode",
	typeToKey(reflect.TypeOf(swarm.ServiceSpec{})):                  "SwarmServiceSpec",
	typeToKey(reflect.TypeOf(swarm.ServiceStatus{})):                "SwarmServiceStatus",
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
	typeToKey(reflect.TypeOf(registry.AuthenticateOKBody{})): "AuthResponse",
	typeToKey(reflect.TypeOf(types.Version{})):               "SystemVersionResponse",
	typeToKey(reflect.TypeOf(types.Info{})):                  "SystemInfoResponse",

	// Volumes rename
	typeToKey(reflect.TypeOf(volume.AccessMode{})):          "VolumeAccessMode",
	typeToKey(reflect.TypeOf(volume.CapacityRange{})):       "VolumeCapacityRange",
	typeToKey(reflect.TypeOf(volume.ClusterVolume{})):       "ClusterVolume",
	typeToKey(reflect.TypeOf(volume.ClusterVolumeSpec{})):   "ClusterVolumeSpec",
	typeToKey(reflect.TypeOf(volume.CreateOptions{})):       "VolumeCreateOptions",
	typeToKey(reflect.TypeOf(volume.Info{})):                "VolumeInfo",
	typeToKey(reflect.TypeOf(volume.ListOptions{})):         "VolumeListOptions",
	typeToKey(reflect.TypeOf(volume.ListResponse{})):        "VolumeListResponse",
	typeToKey(reflect.TypeOf(volume.PublishStatus{})):       "VolumePublishStatus",
	typeToKey(reflect.TypeOf(volume.Secret{})):              "VolumeSecret",
	typeToKey(reflect.TypeOf(volume.Topology{})):            "VolumeTopology",
	typeToKey(reflect.TypeOf(volume.TopologyRequirement{})): "VolumeTopologyRequirement",
	typeToKey(reflect.TypeOf(volume.TypeBlock{})):           "VolumeTypeBlock",
	typeToKey(reflect.TypeOf(volume.TypeMount{})):           "VolumeTypeMount",
	typeToKey(reflect.TypeOf(volume.UpdateOptions{})):       "VolumeUpdateOptions",
	typeToKey(reflect.TypeOf(volume.UsageData{})):           "VolumeUsageData",
	typeToKey(reflect.TypeOf(volume.Volume{})):              "Volume",
	typeToKey(reflect.TypeOf(types.VolumesPruneReport{})):   "VolumesPruneResponse",
}

var dockerTypesToReflect = []reflect.Type{
	reflect.TypeOf(types.IDResponse{}),
	reflect.TypeOf(types.BuildCache{}),
	reflect.TypeOf(types.BuildCachePruneOptions{}),
	reflect.TypeOf(types.BuildCachePruneReport{}),
	reflect.TypeOf(types.BuildResult{}),
	reflect.TypeOf(types.ConfigCreateResponse{}),
	reflect.TypeOf(types.ContainerCreateConfig{}),
	reflect.TypeOf(types.ContainerExecInspect{}),
	reflect.TypeOf(types.ContainerState{}),
	reflect.TypeOf(types.ErrorResponse{}),
	reflect.TypeOf(types.EventsOptions{}),
	reflect.TypeOf(types.ExecConfig{}),
	reflect.TypeOf(types.ExecStartCheck{}),
	reflect.TypeOf(types.GraphDriverData{}),
	reflect.TypeOf(types.Health{}),
	reflect.TypeOf(types.HealthcheckResult{}),
	reflect.TypeOf(types.ImageBuildOutput{}),
	reflect.TypeOf(types.ImageDeleteResponseItem{}),
	reflect.TypeOf(types.ImageInspect{}),
	reflect.TypeOf(types.ImageSummary{}),
	reflect.TypeOf(types.ImagesPruneReport{}),
	reflect.TypeOf(types.MemoryStats{}),
	reflect.TypeOf(types.MountPoint{}),
	reflect.TypeOf(types.NetworkCreateResponse{}),
	reflect.TypeOf(types.NetworkListConfig{}),
	reflect.TypeOf(types.NetworkSettings{}),
	reflect.TypeOf(types.NetworkStats{}),
	reflect.TypeOf(types.NetworksPruneReport{}),
	reflect.TypeOf(types.Plugin{}),
	reflect.TypeOf(types.SecretCreateResponse{}),
	reflect.TypeOf(types.Stats{}),
	reflect.TypeOf(types.SwarmUnlockKeyResponse{}),

	// Configs API
	// GetConfigs(opts basictypes.ConfigListOptions) ([]types.Config, error)
	// CreateConfig(s types.ConfigSpec) (string, error)
	// RemoveConfig(id string) error
	// GetConfig(id string) (types.Config, error)
	// UpdateConfig(idOrName string, version uint64, spec types.ConfigSpec) error
	reflect.TypeOf(swarm.Config{}),
	reflect.TypeOf(swarm.ConfigSpec{}),

	// Containers API
	reflect.TypeOf(container.CreateResponse{}),
	reflect.TypeOf(container.Config{}),
	reflect.TypeOf(container.CreateResponse{}),
	reflect.TypeOf(container.DeviceMapping{}),
	reflect.TypeOf(container.DeviceRequest{}),
	reflect.TypeOf(container.ExecStartOptions{}),
	reflect.TypeOf(container.FilesystemChange{}),
	reflect.TypeOf(container.HealthConfig{}),
	reflect.TypeOf(container.HostConfig{}),
	reflect.TypeOf(container.LogConfig{}),
	reflect.TypeOf(container.Resources{}),
	reflect.TypeOf(container.RestartPolicy{}),
	reflect.TypeOf(container.StopOptions{}),
	reflect.TypeOf(container.UpdateConfig{}),
	reflect.TypeOf(container.WaitExitError{}),
	reflect.TypeOf(container.WaitResponse{}),
	reflect.TypeOf(types.Container{}),
	reflect.TypeOf(types.ContainerExecInspect{}),
	reflect.TypeOf(types.ContainerJSON{}),
	reflect.TypeOf(types.ContainerPathStat{}),
	reflect.TypeOf(types.ContainersPruneReport{}),
	reflect.TypeOf(types.StatsJSON{}),

	// TODO: Distribution API
	// GetRepository(context.Context, reference.Named, *registry.AuthConfig) (distribution.Repository, error)
	reflect.TypeOf(image.HistoryResponseItem{}),

	// Images API
	// Search(ctx context.Context, searchFilters filters.Args, term string, limit int, authConfig *registry.AuthConfig, headers map[string][]string) ([]registry.SearchResult, error)
	reflect.TypeOf(registry.SearchResult{}),

	// Networks API
	// FindNetwork(idName string) (libnetwork.Network, error)
	// GetNetworks(filters.Args, types.NetworkListConfig) ([]types.NetworkResource, error)
	// CreateNetwork(nc types.NetworkCreateRequest) (*types.NetworkCreateResponse, error)
	// ConnectContainerToNetwork(containerName, networkName string, endpointConfig *network.EndpointSettings) error
	// DisconnectContainerFromNetwork(containerName string, networkName string, force bool) error
	// DeleteNetwork(networkID string) error
	// NetworksPrune(ctx context.Context, pruneFilters filters.Args) (*types.NetworksPruneReport, error)
	reflect.TypeOf(types.NetworkResource{}),
	reflect.TypeOf(network.Task{}),
	reflect.TypeOf(network.ConfigReference{}),
	reflect.TypeOf(network.Address{}),
	reflect.TypeOf(network.EndpointIPAMConfig{}),
	reflect.TypeOf(network.EndpointSettings{}),
	reflect.TypeOf(network.IPAM{}),
	reflect.TypeOf(network.IPAMConfig{}),
	reflect.TypeOf(network.PeerInfo{}),
	reflect.TypeOf(network.ServiceInfo{}),
	reflect.TypeOf(types.NetworkConnect{}),
	reflect.TypeOf(types.NetworkCreateRequest{}),
	reflect.TypeOf(types.NetworkCreateResponse{}),
	reflect.TypeOf(types.NetworkDisconnect{}),
	reflect.TypeOf(types.NetworksPruneReport{}),

	// Nodes API
	// GetNodes(basictypes.NodeListOptions) ([]types.Node, error)
	// GetNode(string) (types.Node, error)
	// UpdateNode(string, uint64, types.NodeSpec) error
	// RemoveNode(string, bool) error
	reflect.TypeOf(swarm.Node{}),
	reflect.TypeOf(swarm.NodeSpec{}),

	// Plugins API
	// Disable(name string, config *types.PluginDisableConfig) error
	// Enable(name string, config *types.PluginEnableConfig) error
	// List(filters.Args) ([]types.Plugin, error)
	// Inspect(name string) (*types.Plugin, error)
	// Remove(name string, config *types.PluginRmConfig) error
	// Set(name string, args []string) error
	// Privileges(ctx context.Context, ref reference.Named, metaHeaders http.Header, authConfig *registry.AuthConfig) (types.PluginPrivileges, error)
	// Pull(ctx context.Context, ref reference.Named, name string, metaHeaders http.Header, authConfig *registry.AuthConfig, privileges types.PluginPrivileges, outStream io.Writer, opts ...plugin.CreateOpt) error
	// Push(ctx context.Context, name string, metaHeaders http.Header, authConfig *registry.AuthConfig, outStream io.Writer) error
	// Upgrade(ctx context.Context, ref reference.Named, name string, metaHeaders http.Header, authConfig *registry.AuthConfig, privileges types.PluginPrivileges, outStream io.Writer) error
	// CreateFromContext(ctx context.Context, tarCtx io.ReadCloser, options *types.PluginCreateOptions) error
	reflect.TypeOf(runtime.PluginPrivilege{}),
	reflect.TypeOf(types.Plugin{}),

	// Secrets API
	// GetSecrets(opts basictypes.SecretListOptions) ([]types.Secret, error)
	// CreateSecret(s types.SecretSpec) (string, error)
	// RemoveSecret(idOrName string) error
	// GetSecret(id string) (types.Secret, error)
	// UpdateSecret(idOrName string, version uint64, spec types.SecretSpec) error
	reflect.TypeOf(swarm.Secret{}),
	reflect.TypeOf(swarm.SecretSpec{}),

	// Services API
	// GetServices(basictypes.ServiceListOptions) ([]types.Service, error)
	// GetService(idOrName string, insertDefaults bool) (types.Service, error)
	// CreateService(types.ServiceSpec, string, bool) (*basictypes.ServiceCreateResponse, error)
	// UpdateService(string, uint64, types.ServiceSpec, basictypes.ServiceUpdateOptions, bool) (*basictypes.ServiceUpdateResponse, error)
	// RemoveService(string) error
	reflect.TypeOf(swarm.Service{}),
	reflect.TypeOf(swarm.ServiceSpec{}),
	reflect.TypeOf(types.ServiceCreateResponse{}),
	reflect.TypeOf(types.ServiceUpdateResponse{}),

	// Swarm API
	// Init(req types.InitRequest) (string, error)
	// Join(req types.JoinRequest) error
	// Leave(ctx context.Context, force bool) error
	// Inspect() (types.Swarm, error)
	// Update(uint64, types.Spec, types.UpdateFlags) error
	// GetUnlockKey() (string, error)
	// UnlockSwarm(req types.UnlockRequest) error
	reflect.TypeOf(swarm.InitRequest{}),
	reflect.TypeOf(swarm.JoinRequest{}),
	reflect.TypeOf(swarm.Swarm{}),
	reflect.TypeOf(swarm.Spec{}),
	reflect.TypeOf(swarm.UnlockRequest{}),

	// System API
	// SystemInfo() *types.Info
	// SystemVersion() types.Version
	// SystemDiskUsage(ctx context.Context, opts DiskUsageOptions) (*types.DiskUsage, error)
	// SubscribeToEvents(since, until time.Time, ef filters.Args) ([]events.Message, chan interface{})
	// AuthenticateToRegistry(ctx context.Context, authConfig *registry.AuthConfig) (string, string, error)
	reflect.TypeOf(types.Info{}),
	reflect.TypeOf(types.Version{}),
	reflect.TypeOf(types.DiskUsage{}),
	reflect.TypeOf(events.Message{}),
	reflect.TypeOf(registry.AuthConfig{}),
    reflect.TypeOf(registry.AuthenticateOKBody{}),

	// Tasks API
	// GetTasks(basictypes.TaskListOptions) ([]types.Task, error)
	// GetTask(string) (types.Task, error)
	reflect.TypeOf(swarm.Task{}),

	// Volumes API
	// List(ctx context.Context, filter filters.Args) ([]*volume.Volume, []string, error)
	// Get(ctx context.Context, name string, opts ...opts.GetOption) (*volume.Volume, error)
	// Create(ctx context.Context, name, driverName string, opts ...opts.CreateOption) (*volume.Volume, error)
	// Remove(ctx context.Context, name string, opts ...opts.RemoveOption) error
	// Prune(ctx context.Context, pruneFilters filters.Args) (*types.VolumesPruneReport, error)
	reflect.TypeOf(volume.Volume{}),
	reflect.TypeOf(volume.ListResponse{}),
	reflect.TypeOf(volume.CreateOptions{}),
	reflect.TypeOf(types.VolumesPruneReport{}),
}
