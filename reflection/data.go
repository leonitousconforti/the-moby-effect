package main

import (
	"reflect"
	"time"

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
	"github.com/docker/go-connections/nat"
	"github.com/opencontainers/go-digest"
)

var typesToReplace = map[reflect.Type]TSType{
	reflect.TypeOf(time.Time{}):       {StrRepresentation: "Schema.DateFromString", Nullable: false},
	reflect.TypeOf(digest.Digest("")): {StrRepresentation: "MobySchemas.Digest", Nullable: false},
	reflect.TypeOf(nat.Port("")):      {StrRepresentation: "MobySchemas.PortWithMaybeProtocol", Nullable: false},
	reflect.TypeOf(nat.PortMap{}):     {StrRepresentation: "MobySchemas.PortMap", Nullable: false},
	reflect.TypeOf(nat.PortSet{}):     {StrRepresentation: "MobySchemas.PortSet", Nullable: false},
	reflect.TypeOf(nat.PortBinding{}): {StrRepresentation: "MobySchemas.PortBinding", Nullable: false},
}

var dockerTypesToReflect = []reflect.Type{
	// Misc API
	reflect.TypeOf(archive.Change{}),
	reflect.TypeOf(jsonmessage.JSONMessage{}),

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
	reflect.TypeOf(container.ExecStartOptions{}),
	reflect.TypeOf(container.PathStat{}),
	reflect.TypeOf(container.CreateRequest{}),
	reflect.TypeOf(container.HostConfig{}),
	reflect.TypeOf(container.TopResponse{}),
	reflect.TypeOf(container.StatsResponse{}),
	reflect.TypeOf(container.WaitResponse{}),
	reflect.TypeOf(container.Summary{}),
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
	reflect.TypeOf(volume.CreateOptions{}),
}
