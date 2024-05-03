/**
 * Our moby connection needs to be an extension of the effect platform-node
 * httpAgent so that it will still be compatible with all the other
 * platform-node http methods, but it would be nice if it had a few other things
 * as well. The nodeRequestUrl is the url that the node http client will use to
 * make requests. And while we don't need to keep track of the connection
 * options for anything yet, it wouldn't hurt to add them.
 */
export * as agent-helpers from "./agent-helpers.js"

/**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the configs list.
     *
     * Available filters:
     *
     * - `id=<config id>`
     * - `label=<key> or label=<key>=value`
     * - `name=<config name>`
     * - `names=<config name>`
     */
export * as configs from "./configs.js"

/**
     * Return this number of most recently created containers, including
     * non-running ones.
     */
export * as containers from "./containers.js"

/**
 * When the TTY setting is enabled in POST /containers/create, the stream is not
 * multiplexed. The data exchanged over the hijacked connection is simply the
 * raw data from the process PTY and client's stdin.
 */
export * as demux-helpers from "./demux-helpers.js"

/**
     * Get image information from the registry
     *
     * @param name - Image name or id
     */
export * as distribution from "./distribution.js"

/**
 * Implements the `docker pull` command.
 *
 * Note: it doesn't have all the flags that the images create endpoint exposes.
 */
export * as docker-helpers from "./docker-helpers.js"

/**
     * Create an exec instance
     *
     * @param execConfig - Exec configuration
     * @param id - ID or name of container
     */
export * as execs from "./execs.js"

/**
     * Show all images. Only images from a final layer (no children) are shown
     * by default.
     */
export * as images from "./images.js"

/**
 * From
 * https://docs.docker.com/engine/reference/commandline/dockerd/#daemon-socket-option
 *
 * "The Docker client will honor the DOCKER_HOST environment variable to set the
 * -H flag for the client"
 *
 * And then from
 * https://docs.docker.com/engine/reference/commandline/dockerd/#bind-docker-to-another-hostport-or-a-unix-socket
 *
 * "-H accepts host and port assignment in the following format:
 * `tcp://[host]:[port][path]` or `unix://path`
 *
 * For example:
 *
 * - `unix://path/to/socket` -> Unix socket located at path/to/socket
 * - When -H is empty, it will default to the same value as when no -H was passed
 *   in
 * - `http://host:port/path` -> HTTP connection on host:port and prepend path to
 *   all requests
 * - `https://host:port/path` -> HTTPS connection on host:port and prepend path to
 *   all requests
 * - `ssh://me@example.com:22/var/run/docker.sock` -> SSH connection to
 *   example.com on port 22
 */
export * as moby from "./moby.js"

/**
     * JSON encoded value of the filters (a `map[string][]string`) to process on
     * the networks list.
     *
     * Available filters:
     *
     * - `dangling=<boolean>` When set to `true` (or `1`), returns all networks
     *   that are not in use by a container. When set to `false` (or `0`), only
     *   networks that are in use by one or more containers are returned.
     * - `driver=<driver-name>` Matches a network's driver.
     * - `id=<network-id>` Matches all or part of a network ID.
     * - `label=<key>` or `label=<key>=<value>` of a network label.
     * - `name=<network-name>` Matches all or part of a network name.
     * - `scope=["swarm"|"global"|"local"]` Filters networks by scope (`swarm`,
     *   `global`, or `local`).
     * - `type=["custom"|"builtin"]` Filters networks by type. The `custom`
     *   keyword returns all user-defined networks.
     */
export * as networks from "./networks.js"

/**
     * Filters to process on the nodes list, encoded as JSON (a
     * `map[string][]string`).
     *
     * Available filters:
     *
     * - `id=<node id>`
     * - `label=<engine label>`
     * - `membership=`(`accepted`|`pending`)`
     * - `name=<node name>`
     * - `node.label=<node label>`
     * - `role=`(`manager`|`worker`)`
     */
export * as nodes from "./nodes.js"

/**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the plugin list.
     *
     * Available filters:
     *
     * - `capability=<capability name>`
     * - `enable=<true>|<false>`
     */
export * as plugins from "./plugins.js"

/**
 * Helper interface to expose the underlying socket from the effect NodeHttp
 * response. Useful for multiplexing the response stream.
 */
export * as request-helpers from "./request-helpers.js"

/**
     * The mount type:
     *
     * - `bind` a mount of a file or directory from the host into the container.
     * - `volume` a docker volume with the given `Name`.
     * - `tmpfs` a `tmpfs`.
     * - `npipe` a named pipe from the host into the container.
     * - `cluster` a Swarm cluster volume
     */
export * as schemas from "./schemas.js"

/**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the secrets list.
     *
     * Available filters:
     *
     * - `id=<secret id>`
     * - `label=<key> or label=<key>=value`
     * - `name=<secret name>`
     * - `names=<secret name>`
     */
export * as secrets from "./secrets.js"

/**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the services list.
     *
     * Available filters:
     *
     * - `id=<service id>`
     * - `label=<service label>`
     * - `mode=["replicated"|"global"]`
     * - `name=<service name>`
     */
export * as services from "./services.js"

/**
     * Start a new interactive session with a server. Session allows server to
     * call back to the client for advanced capabilities. ### Hijacking This
     * endpoint hijacks the HTTP connection to HTTP2 transport that allows the
     * client to expose gPRC services on that connection. For example, the
     * client sends this request to upgrade the connection: `POST /session
     * HTTP/1.1 Upgrade: h2c Connection: Upgrade` The Docker daemon responds
     * with a `101 UPGRADED` response follow with the raw stream: `HTTP/1.1 101
     * UPGRADED Connection: Upgrade Upgrade: h2c`
     */
export * as session from "./session.js"

/**
     * Force leave swarm, even if this is the last manager or that it will break
     * the cluster.
     */
export * as swarm from "./swarm.js"

/**
     * A JSON encoded value of filters (a `map[string][]string`) to process on
     * the event list. Available filters:
     *
     * - `config=<string>` config name or ID
     * - `container=<string>` container name or ID
     * - `daemon=<string>` daemon name or ID
     * - `event=<string>` event type
     * - `image=<string>` image name or ID
     * - `label=<string>` image or container label
     * - `network=<string>` network name or ID
     * - `node=<string>` node ID
     * - `plugin`=<string> plugin name or ID
     * - `scope`=<string> local or swarm
     * - `secret=<string>` secret name or ID
     * - `service=<string>` service name or ID
     * - `type=<string>` object to filter by, one of `container`, `image`,
     *   `volume`, `network`, `daemon`, `plugin`, `node`, `service`, `secret` or
     *   `config`
     * - `volume=<string>` volume name
     */
export * as system from "./system.js"

/**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the tasks list.
     *
     * Available filters:
     *
     * - `desired-state=(running | shutdown | accepted)`
     * - `id=<task id>`
     * - `label=key` or `label="key=value"`
     * - `name=<task name>`
     * - `node=<node id or name>`
     * - `service=<service name>`
     */
export * as tasks from "./tasks.js"

/**
     * JSON encoded value of the filters (a `map[string][]string`) to process on
     * the volumes list. Available filters:
     *
     * - `dangling=<boolean>` When set to `true` (or `1`), returns all volumes
     *   that are not in use by a container. When set to `false` (or `0`), only
     *   volumes that are in use by one or more containers are returned.
     * - `driver=<volume-driver-name>` Matches volumes based on their driver.
     * - `label=<key>` or `label=<key>:<value>` Matches volumes based on the
     *   presence of a `label` alone or a `label` and a value.
     * - `name=<volume-name>` Matches all or part of a volume name.
     */
export * as volumes from "./volumes.js"
