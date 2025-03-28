/**
 * Moby engine shortcut.
 *
 * @since 1.0.0
 */

export {
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
     * @since 1.0.0
     * @category Layers
     */
    type MobyLayer,

    /**
     * @since 1.0.0
     * @category Layers
     */
    type MobyLayerWithoutHttpClientOrWebsocketConstructor,
} from "./internal/engines/moby.js";
