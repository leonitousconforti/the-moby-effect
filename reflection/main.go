package main

import (
	"bufio"
	"fmt"
	"os"
	"path"
	"reflect"
	"strings"

	// "github.com/docker/docker/api/types"
	// "github.com/docker/docker/api/types/container"
	// "github.com/docker/docker/api/types/events"
	// "github.com/docker/docker/api/types/image"
	// "github.com/docker/docker/api/types/mount"
	// "github.com/docker/docker/api/types/network"
	// "github.com/docker/docker/api/types/registry"
	// "github.com/docker/docker/api/types/swarm"
	"github.com/docker/docker/api/types/volume"
)

var reflectedTypes = map[string]*TSModelType{}

var dockerTypesToReflect = []reflect.Type{
	// github.com/docker/docker/api/types/volume
    // Can not reflect: (are all just type = string)
    //      reflect.TypeOf(volume.Availability{}),
    //      reflect.TypeOf(volume.PublishState{}),
    //      reflect.TypeOf(volume.Scope{}),
    //      reflect.TypeOf(volume.SharingMode{}),
    // Don't want to/ don't need to reflect:
    //      reflect.TypeOf(volume.ListOptions{}),
    reflect.TypeOf(volume.AccessMode{}),
    reflect.TypeOf(volume.CapacityRange{}),
    reflect.TypeOf(volume.ClusterVolume{}),
    reflect.TypeOf(volume.ClusterVolumeSpec{}),
    reflect.TypeOf(volume.CreateOptions{}),
    reflect.TypeOf(volume.Info{}),
    reflect.TypeOf(volume.ListResponse{}),
    reflect.TypeOf(volume.PublishStatus{}),
    reflect.TypeOf(volume.Secret{}),
    reflect.TypeOf(volume.Topology{}),
    reflect.TypeOf(volume.TopologyRequirement{}),
    reflect.TypeOf(volume.TypeBlock{}),
    reflect.TypeOf(volume.TypeMount{}),
    reflect.TypeOf(volume.UpdateOptions{}),
    reflect.TypeOf(volume.UsageData{}),
    reflect.TypeOf(volume.Volume{}),

	// // github.com/docker/docker/api/types/swarm
	// reflect.TypeOf(swarm.Annotations{}),
	// reflect.TypeOf(swarm.CAConfig{}),
	// reflect.TypeOf(swarm.ClusterInfo{}),
	// reflect.TypeOf(swarm.Config{}),
	// reflect.TypeOf(swarm.ConfigReference{}),
	// reflect.TypeOf(swarm.ConfigReferenceFileTarget{}),
	// reflect.TypeOf(swarm.ConfigReferenceRuntimeTarget{}),
	// reflect.TypeOf(swarm.ConfigSpec{}),
	// reflect.TypeOf(swarm.ContainerSpec{}),
	// reflect.TypeOf(swarm.ContainerStatus{}),
	// reflect.TypeOf(swarm.CredentialSpec{}),
	// reflect.TypeOf(swarm.DNSConfig{}),
	// reflect.TypeOf(swarm.DiscreteGenericResource{}),
	// reflect.TypeOf(swarm.DispatcherConfig{}),
	// reflect.TypeOf(swarm.Driver{}),
	// reflect.TypeOf(swarm.EncryptionConfig{}),
	// reflect.TypeOf(swarm.Endpoint{}),
	// reflect.TypeOf(swarm.EndpointSpec{}),
	// reflect.TypeOf(swarm.EndpointVirtualIP{}),
	// reflect.TypeOf(swarm.EngineDescription{}),
	// reflect.TypeOf(swarm.ExternalCA{}),
	// reflect.TypeOf(swarm.GenericResource{}),
	// reflect.TypeOf(swarm.GlobalJob{}),
	// reflect.TypeOf(swarm.GlobalService{}),
	// reflect.TypeOf(swarm.IPAMConfig{}),
	// reflect.TypeOf(swarm.IPAMOptions{}),
	// reflect.TypeOf(swarm.Info{}),
	// reflect.TypeOf(swarm.InitRequest{}),
	// reflect.TypeOf(swarm.JobStatus{}),
	// reflect.TypeOf(swarm.JoinRequest{}),
	// reflect.TypeOf(swarm.JoinTokens{}),
	// reflect.TypeOf(swarm.Limit{}),
	// reflect.TypeOf(swarm.ManagerStatus{}),
	// reflect.TypeOf(swarm.Meta{}),
	// reflect.TypeOf(swarm.NamedGenericResource{}),
	// reflect.TypeOf(swarm.Network{}),
	// reflect.TypeOf(swarm.NetworkAttachment{}),
	// reflect.TypeOf(swarm.NetworkAttachmentConfig{}),
	// reflect.TypeOf(swarm.NetworkAttachmentSpec{}),
	// reflect.TypeOf(swarm.NetworkSpec{}),
	// reflect.TypeOf(swarm.Node{}),
	// reflect.TypeOf(swarm.NodeCSIInfo{}),
	// reflect.TypeOf(swarm.NodeDescription{}),
	// reflect.TypeOf(swarm.NodeSpec{}),
	// reflect.TypeOf(swarm.NodeStatus{}),
	// reflect.TypeOf(swarm.OrchestrationConfig{}),
	// reflect.TypeOf(swarm.Peer{}),
	// reflect.TypeOf(swarm.Placement{}),
	// reflect.TypeOf(swarm.PlacementPreference{}),
	// reflect.TypeOf(swarm.Platform{}),
	// reflect.TypeOf(swarm.PluginDescription{}),
	// reflect.TypeOf(swarm.PortConfig{}),
	// reflect.TypeOf(swarm.PortStatus{}),
	// reflect.TypeOf(swarm.Privileges{}),
	// reflect.TypeOf(swarm.RaftConfig{}),
	// reflect.TypeOf(swarm.ReplicatedJob{}),
	// reflect.TypeOf(swarm.ReplicatedService{}),
	// reflect.TypeOf(swarm.ResourceRequirements{}),
	// reflect.TypeOf(swarm.Resources{}),
	// reflect.TypeOf(swarm.RestartPolicy{}),
	// reflect.TypeOf(swarm.SELinuxContext{}),
	// reflect.TypeOf(swarm.Secret{}),
	// reflect.TypeOf(swarm.SecretReference{}),
	// reflect.TypeOf(swarm.SecretReferenceFileTarget{}),
	// reflect.TypeOf(swarm.SecretSpec{}),
	// reflect.TypeOf(swarm.Service{}),
	// reflect.TypeOf(swarm.ServiceMode{}),
	// reflect.TypeOf(swarm.ServiceSpec{}),
	// reflect.TypeOf(swarm.ServiceStatus{}),
	// reflect.TypeOf(swarm.Spec{}),
	// reflect.TypeOf(swarm.SpreadOver{}),
	// reflect.TypeOf(swarm.Status{}),
	// reflect.TypeOf(swarm.Swarm{}),
	// reflect.TypeOf(swarm.TLSInfo{}),
	// reflect.TypeOf(swarm.Task{}),
	// reflect.TypeOf(swarm.TaskDefaults{}),
	// reflect.TypeOf(swarm.TaskSpec{}),
	// reflect.TypeOf(swarm.TaskStatus{}),
	// reflect.TypeOf(swarm.Topology{}),
	// reflect.TypeOf(swarm.UnlockRequest{}),
	// reflect.TypeOf(swarm.UpdateConfig{}),
	// reflect.TypeOf(swarm.UpdateFlags{}),
	// reflect.TypeOf(swarm.UpdateStatus{}),
	// reflect.TypeOf(swarm.Version{}),
	// reflect.TypeOf(swarm.VolumeAttachment{}),

	// // github.com/docker/docker/api/types/registry
	// reflect.TypeOf(registry.AuthConfig{}),
	// reflect.TypeOf(registry.AuthenticateOKBody{}),
	// reflect.TypeOf(registry.DistributionInspect{}),
	// reflect.TypeOf(registry.IndexInfo{}),
	// reflect.TypeOf(registry.SearchResult{}),
	// reflect.TypeOf(registry.SearchResults{}),
	// reflect.TypeOf(registry.ServiceConfig{}),

	// // github.com/docker/docker/api/types/network
	// reflect.TypeOf(network.Address{}),
	// reflect.TypeOf(network.ConfigReference{}),
	// reflect.TypeOf(network.EndpointIPAMConfig{}),
	// reflect.TypeOf(network.EndpointSettings{}),
	// reflect.TypeOf(network.IPAM{}),
	// reflect.TypeOf(network.IPAMConfig{}),
	// reflect.TypeOf(network.NetworkingConfig{}),
	// reflect.TypeOf(network.PeerInfo{}),
	// reflect.TypeOf(network.ServiceInfo{}),
	// reflect.TypeOf(network.Task{}),

	// // github.com/docker/docker/api/types/mount
	// reflect.TypeOf(mount.BindOptions{}),
	// reflect.TypeOf(mount.ClusterOptions{}),
	// reflect.TypeOf(mount.Driver{}),
	// reflect.TypeOf(mount.Mount{}),
	// reflect.TypeOf(mount.TmpfsOptions{}),
	// reflect.TypeOf(mount.VolumeOptions{}),

	// // github.com/docker/docker/api/types/image
	// reflect.TypeOf(image.GetImageOpts{}),
	// reflect.TypeOf(image.HistoryResponseItem{}),

	// // github.com/docker/docker/api/types/events
	// reflect.TypeOf(events.Actor{}),
	// reflect.TypeOf(events.Message{}),

	// // github.com/docker/docker/api/types/container
	// // reflect.TypeOf(container.Config{}),
	// reflect.TypeOf(container.ContainerTopOKBody{}),
	// reflect.TypeOf(container.ContainerUpdateOKBody{}),
	// reflect.TypeOf(container.CreateResponse{}),
	// reflect.TypeOf(container.DeviceMapping{}),
	// reflect.TypeOf(container.DeviceRequest{}),
	// reflect.TypeOf(container.ExecStartOptions{}),
	// reflect.TypeOf(container.FilesystemChange{}),
	// reflect.TypeOf(container.HealthConfig{}),
	// reflect.TypeOf(container.HostConfig{}),
	// reflect.TypeOf(container.LogConfig{}),
	// reflect.TypeOf(container.Resources{}),
	// reflect.TypeOf(container.RestartPolicy{}),
	// reflect.TypeOf(container.StopOptions{}),
	// reflect.TypeOf(container.UpdateConfig{}),
	// reflect.TypeOf(container.WaitExitError{}),
	// reflect.TypeOf(container.WaitResponse{}),

	// // github.com/docker/docker/api/types
	// reflect.TypeOf(types.BlkioStatEntry{}),
	// reflect.TypeOf(types.BlkioStats{}),
	// reflect.TypeOf(types.BuildCache{}),
	// reflect.TypeOf(types.BuildCachePruneOptions{}),
	// reflect.TypeOf(types.BuildCachePruneReport{}),
	// reflect.TypeOf(types.BuildResult{}),
	// reflect.TypeOf(types.CPUStats{}),
	// reflect.TypeOf(types.CPUUsage{}),
	// reflect.TypeOf(types.Checkpoint{}),
	// reflect.TypeOf(types.CheckpointCreateOptions{}),
	// reflect.TypeOf(types.CheckpointDeleteOptions{}),
	// reflect.TypeOf(types.CheckpointListOptions{}),
	// reflect.TypeOf(types.Commit{}),
	// reflect.TypeOf(types.ComponentVersion{}),
	// reflect.TypeOf(types.ConfigCreateResponse{}),
	// reflect.TypeOf(types.ConfigListOptions{}),
	// reflect.TypeOf(types.Container{}),
	// reflect.TypeOf(types.ContainerAttachOptions{}),
	// // reflect.TypeOf(types.ContainerCommitOptions{}),
	// // reflect.TypeOf(types.ContainerCreateConfig{}),
	// reflect.TypeOf(types.ContainerExecInspect{}),
	// // reflect.TypeOf(types.ContainerJSON{}),
	// reflect.TypeOf(types.ContainerJSONBase{}),
	// reflect.TypeOf(types.ContainerListOptions{}),
	// reflect.TypeOf(types.ContainerLogsOptions{}),
	// reflect.TypeOf(types.ContainerNode{}),
	// reflect.TypeOf(types.ContainerPathStat{}),
	// reflect.TypeOf(types.ContainerRemoveOptions{}),
	// reflect.TypeOf(types.ContainerRmConfig{}),
	// reflect.TypeOf(types.ContainerStartOptions{}),
	// reflect.TypeOf(types.ContainerState{}),
	// reflect.TypeOf(types.ContainerStats{}),
	// reflect.TypeOf(types.ContainersPruneReport{}),
	// reflect.TypeOf(types.CopyConfig{}),
	// reflect.TypeOf(types.CopyToContainerOptions{}),
	// reflect.TypeOf(types.DefaultNetworkSettings{}),
	// reflect.TypeOf(types.DiskUsage{}),
	// reflect.TypeOf(types.DiskUsageOptions{}),
	// reflect.TypeOf(types.EndpointResource{}),
	// reflect.TypeOf(types.ErrorResponse{}),
	// reflect.TypeOf(types.EventsOptions{}),
	// reflect.TypeOf(types.ExecConfig{}),
	// reflect.TypeOf(types.ExecStartCheck{}),
	// reflect.TypeOf(types.GraphDriverData{}),
	// reflect.TypeOf(types.Health{}),
	// reflect.TypeOf(types.HealthcheckResult{}),
	// reflect.TypeOf(types.HijackedResponse{}),
	// reflect.TypeOf(types.IDResponse{}),
	// reflect.TypeOf(types.ImageBuildOptions{}),
	// reflect.TypeOf(types.ImageBuildOutput{}),
	// reflect.TypeOf(types.ImageBuildResponse{}),
	// reflect.TypeOf(types.ImageCreateOptions{}),
	// reflect.TypeOf(types.ImageDeleteResponseItem{}),
	// reflect.TypeOf(types.ImageImportOptions{}),
	// reflect.TypeOf(types.ImageImportSource{}),
	// // reflect.TypeOf(types.ImageInspect{}),
	// reflect.TypeOf(types.ImageListOptions{}),
	// reflect.TypeOf(types.ImageLoadResponse{}),
	// reflect.TypeOf(types.ImageMetadata{}),
	// reflect.TypeOf(types.ImagePullOptions{}),
	// reflect.TypeOf(types.ImagePushOptions{}),
	// reflect.TypeOf(types.ImageRemoveOptions{}),
	// reflect.TypeOf(types.ImageSearchOptions{}),
	// reflect.TypeOf(types.ImageSummary{}),
	// reflect.TypeOf(types.ImagesPruneReport{}),
	// reflect.TypeOf(types.Info{}),
	// reflect.TypeOf(types.KeyValue{}),
	// reflect.TypeOf(types.MemoryStats{}),
	// reflect.TypeOf(types.MountPoint{}),
	// reflect.TypeOf(types.NetworkAddressPool{}),
	// reflect.TypeOf(types.NetworkConnect{}),
	// reflect.TypeOf(types.NetworkCreate{}),
	// reflect.TypeOf(types.NetworkCreateRequest{}),
	// reflect.TypeOf(types.NetworkCreateResponse{}),
	// reflect.TypeOf(types.NetworkDisconnect{}),
	// reflect.TypeOf(types.NetworkInspectOptions{}),
	// reflect.TypeOf(types.NetworkListConfig{}),
	// reflect.TypeOf(types.NetworkListOptions{}),
	// reflect.TypeOf(types.NetworkResource{}),
	// reflect.TypeOf(types.NetworkSettings{}),
	// reflect.TypeOf(types.NetworkSettingsBase{}),
	// reflect.TypeOf(types.NetworkStats{}),
	// reflect.TypeOf(types.NetworksPruneReport{}),
	// reflect.TypeOf(types.NodeListOptions{}),
	// reflect.TypeOf(types.NodeRemoveOptions{}),
	// reflect.TypeOf(types.PidsStats{}),
	// reflect.TypeOf(types.Ping{}),
	// reflect.TypeOf(types.Plugin{}),
	// reflect.TypeOf(types.PluginConfig{}),
	// reflect.TypeOf(types.PluginConfigArgs{}),
	// reflect.TypeOf(types.PluginConfigInterface{}),
	// reflect.TypeOf(types.PluginConfigLinux{}),
	// reflect.TypeOf(types.PluginConfigNetwork{}),
	// reflect.TypeOf(types.PluginConfigRootfs{}),
	// reflect.TypeOf(types.PluginConfigUser{}),
	// reflect.TypeOf(types.PluginCreateOptions{}),
	// reflect.TypeOf(types.PluginDevice{}),
	// reflect.TypeOf(types.PluginDisableConfig{}),
	// reflect.TypeOf(types.PluginDisableOptions{}),
	// reflect.TypeOf(types.PluginEnableConfig{}),
	// reflect.TypeOf(types.PluginEnableOptions{}),
	// reflect.TypeOf(types.PluginEnv{}),
	// reflect.TypeOf(types.PluginInstallOptions{}),
	// reflect.TypeOf(types.PluginInterfaceType{}),
	// reflect.TypeOf(types.PluginMount{}),
	// reflect.TypeOf(types.PluginPrivilege{}),
	// reflect.TypeOf(types.PluginRemoveOptions{}),
	// reflect.TypeOf(types.PluginRmConfig{}),
	// reflect.TypeOf(types.PluginSettings{}),
	// reflect.TypeOf(types.PluginsInfo{}),
	// reflect.TypeOf(types.Port{}),
	// reflect.TypeOf(types.PushResult{}),
	// reflect.TypeOf(types.ResizeOptions{}),
	// reflect.TypeOf(types.RootFS{}),
	// reflect.TypeOf(types.Runtime{}),
	// reflect.TypeOf(types.SecretCreateResponse{}),
	// reflect.TypeOf(types.SecretListOptions{}),
	// reflect.TypeOf(types.SecurityOpt{}),
	// reflect.TypeOf(types.ServiceCreateOptions{}),
	// reflect.TypeOf(types.ServiceCreateResponse{}),
	// reflect.TypeOf(types.ServiceInspectOptions{}),
	// reflect.TypeOf(types.ServiceListOptions{}),
	// reflect.TypeOf(types.ServiceUpdateOptions{}),
	// reflect.TypeOf(types.ServiceUpdateResponse{}),
	// reflect.TypeOf(types.ShimConfig{}),
	// reflect.TypeOf(types.Stats{}),
	// reflect.TypeOf(types.StatsJSON{}),
	// reflect.TypeOf(types.StorageStats{}),
	// reflect.TypeOf(types.SummaryNetworkSettings{}),
	// reflect.TypeOf(types.SwarmUnlockKeyResponse{}),
	// reflect.TypeOf(types.TaskListOptions{}),
	// reflect.TypeOf(types.ThrottlingData{}),
	// reflect.TypeOf(types.Version{}),
	// reflect.TypeOf(types.VolumesPruneReport{}),
}

func typeToKey(t reflect.Type) string {
	return t.String()
}

func ultimateType(t reflect.Type) reflect.Type {
	for {
		switch t.Kind() {
		case reflect.Array, reflect.Chan, reflect.Map, reflect.Ptr, reflect.Slice:
			t = t.Elem()
		default:
			return t
		}
	}
}

func reflectTypeMembers(t reflect.Type, m *TSModelType) {
	for i := 0; i < t.NumField(); i++ {
		f := t.Field(i)

		switch f.Type.Kind() {
		case reflect.Func, reflect.Uintptr:
			continue
		}

		if f.Type.Kind() == reflect.Struct && f.Type.Name() == "" {
			// TODO: Inline struct definitions. Probably need to write an inline class named the property name?
			continue
		}

		// If the type is anonymous we need to inline its values to this model.
		if f.Anonymous {
			ut := ultimateType(f.Type)
			reflectType(ut)
			newType := reflectedTypes[typeToKey(ut)]
			if newType == nil {
				panic(fmt.Sprintf("Failed to reflect ultimate type (%s) for anonymous member (%s) on type (%s)", ut, f.Name, t))
			}

			// Now we need to add in all of the inherited types parameters
			m.Properties = append(m.Properties, newType.Properties...)
		} else {
			// If we are referencing a struct that isn't inline or anonymous we need to update it too.
			if ut := ultimateType(f.Type); ut.Kind() == reflect.Struct {
				if _, ok := TSInboxTypesMap[f.Type.Kind()]; !ok {
					reflectType(ut)
				}
			}

			// If the json tag says to omit we skip generation.
			jsonTag, _ := JsonTagFromString(f.Tag.Get("json"))

			if jsonTag.Skip {
				continue
			}

			var name string
			if strings.Compare(jsonTag.Name, "") == 0 {
				name = f.Name
			} else {
				name = jsonTag.Name
			}
			csProp := TSProperty{Name: name, Type: tsType(f.Type), IsOpt: jsonTag.OmitEmpty}
			m.Properties = append(m.Properties, csProp)
		}
	}
}

func reflectType(t reflect.Type) {
	k := typeToKey(t)
	var activeType *TSModelType
	var alreadyInserted bool
	if activeType, alreadyInserted = reflectedTypes[k]; alreadyInserted {
		if activeType.IsStarted {
			return
		}
	}

	if t.Name() == "" {
		panic("Unable to reflect a type with no name")
	}

	name := t.Name()
	if activeType == nil {
		activeType = NewModel(name, t.String())
	}

	activeType.IsStarted = true
	if !alreadyInserted {
		reflectedTypes[k] = activeType
	}

	reflectTypeMembers(t, activeType)
}

func main() {
	cwd, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	sourcePath := path.Join(cwd, "generated")
	files, err := os.ReadDir(sourcePath)
	if err != nil {
		panic(err)
	}

	for _, file := range files {
		if strings.HasSuffix(file.Name(), ".generated.ts") {
			err := os.Remove(path.Join(sourcePath, file.Name()))
			if err != nil {
				panic(err)
			}
		}
	}

	for _, t := range dockerTypesToReflect {
		reflectType(t)
	}

	for _, v := range reflectedTypes {
		f, err := os.CreateTemp(sourcePath, "")
		if err != nil {
			panic(err)
		}
		defer f.Close()

		b := bufio.NewWriter(f)
		v.Write(b)
		err = b.Flush()
		if err != nil {
			os.Remove(f.Name())
			panic(err)
		}

		f.Close()
		err = os.Rename(f.Name(), path.Join(sourcePath, v.Name+".generated.ts"))
		if err != nil {
			panic(err)
		}
	}

	f, err := os.CreateTemp(sourcePath, "")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	b := bufio.NewWriter(f)
	for _, z := range reflectedTypes {
		fmt.Fprintln(b, "export * from \"./"+z.Name+".generated.js\";")
	}
	err = b.Flush()
	if err != nil {
		os.Remove(f.Name())
		panic(err)
	}
	f.Close()
	err = os.Rename(f.Name(), path.Join(sourcePath, "index.ts"))
	if err != nil {
		panic(err)
	}
}
