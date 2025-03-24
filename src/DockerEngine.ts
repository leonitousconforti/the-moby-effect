/**
 * Docker engine shortcut.
 *
 * @since 1.0.0
 */

export {
    /**
     * Implements the `docker build` command. It doesn't have all the flags that
     * the images build endpoint exposes.
     *
     * @since 1.0.0
     * @category Docker
     */
    build,

    /**
     * Implements the `docker build` command as a scoped effect. When the scope
     * is closed, the built image is removed. It doesn't have all the flags that
     * the images build endpoint exposes.
     *
     * @since 1.0.0
     * @category Docker
     */
    buildScoped,

    /**
     * Implements the `docker exec` command in a blocking fashion. Incompatible
     * with web.
     *
     * @since 1.0.0
     * @category Docker
     */
    exec,

    /**
     * Implements the `docker exec` command in a non blocking fashion.
     * Incompatible with web when not detached.
     *
     * @since 1.0.0
     * @category Docker
     */
    execNonBlocking,

    /**
     * Implements the `docker exec` command in a blocking fashion with
     * websockets as the underlying transport instead of the docker engine exec
     * apis so that is can be compatible with web.
     *
     * @since 1.0.0
     * @category Docker
     */
    execWebsockets,

    /**
     * Implements the `docker exec` command in a non blocking fashion with
     * websockets as the underlying transport instead of the docker engine exec
     * apis so that is can be compatible with web.
     *
     * @since 1.0.0
     * @category Docker
     */
    execWebsocketsNonBlocking,

    /**
     * Implements the `docker images` command.
     *
     * @since 1.0.0
     * @category Docker
     */
    images,

    /**
     * Implements the `docker info` command.
     *
     * @since 1.0.0
     * @category Docker
     */
    info,

    /**
     * @since 1.0.0
     * @category Layers
     */
    layerAgnostic,

    /**
     * @since 1.0.0
     * @category Layers
     */
    layerBun,

    /**
     * @since 1.0.0
     * @category Layers
     */
    layerDeno,

    /**
     * @since 1.0.0
     * @category Layers
     */
    layerFetch,

    /**
     * @since 1.0.0
     * @category Layers
     */
    layerNodeJS,

    /**
     * @since 1.0.0
     * @category Layers
     */
    layerUndici,

    /**
     * @since 1.0.0
     * @category Layers
     */
    layerWeb,

    /**
     * @since 1.0.0
     * @category Layers
     */
    layerWithoutHttpCLient,

    /**
     * Implements the `docker ping` command.
     *
     * @since 1.0.0
     * @category Docker
     */
    ping,

    /**
     * Implements the `docker ping` command.
     *
     * @since 1.0.0
     * @category Docker
     */
    pingHead,

    /**
     * Implements the `docker ps` command.
     *
     * @since 1.0.0
     * @category Docker
     */
    ps,

    /**
     * Implements the `docker pull` command. It does not have all the flags that
     * the images create endpoint exposes.
     *
     * @since 1.0.0
     * @category Docker
     */
    pull,

    /**
     * Implements the `docker pull` command as a scoped effect. When the scope
     * is closed, the pulled image is removed. It doesn't have all the flags
     * that the images create endpoint exposes.
     *
     * @since 1.0.0
     * @category Docker
     */
    pullScoped,

    /**
     * Implements the `docker push` command.
     *
     * @since 1.0.0
     * @category Docker
     */
    push,

    /**
     * Implements `docker run` command.
     *
     * @since 1.0.0
     * @category Docker
     */
    run,

    /**
     * Implements `docker run` command as a scoped effect. When the scope is
     * closed, both the image and the container is removed.
     *
     * @since 1.0.0
     * @category Docker
     */
    runScoped,

    /**
     * Implements the `docker search` command.
     *
     * @since 1.0.0
     * @category Docker
     */
    search,

    /**
     * Implements the `docker start` command.
     *
     * @since 1.0.0
     * @category Docker
     */
    start,

    /**
     * Implements the `docker stop` command.
     *
     * @since 1.0.0
     * @category Docker
     */
    stop,

    /**
     * Implements the `docker version` command.
     *
     * @since 1.0.0
     * @category Docker
     */
    version,

    /**
     * @since 1.0.0
     * @category Layers
     */
    type DockerLayer,

    /**
     * @since 1.0.0
     * @category Layers
     */
    type DockerLayerWithoutHttpClientOrWebsocketConstructor,
} from "./internal/engines/docker.js";
