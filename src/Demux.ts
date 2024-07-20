/**
 * Demux utilities for different types of docker streams.
 *
 * @since 1.0.0
 */

export {
    demuxBidirectionalSocket,
    demuxSocketFromStdinToStdoutAndStderr,
    demuxSocketWithInputToConsole,
} from "./demux/Common.js";
export { demuxMultiplexedSocket } from "./demux/Multiplexed.js";
export { demuxBidirectionalRawSocket, demuxUnidirectionalRawSockets } from "./demux/Raw.js";
