/**
 * Demux utilities for different types of docker streams.
 *
 * @since 1.0.0
 */

import * as commonInternal from "./demux/Common.js";
import * as multiplexedInternal from "./demux/Multiplexed.js";
import * as rawInternal from "./demux/Raw.js";

/**
 * Demux an http socket. The source stream is the stream that you want to
 * forward to the containers stdin. If the socket is a raw stream, then there
 * will only be one sink that combines the containers stdout and stderr. if the
 * socket is a multiplexed stream, then there will be two sinks, one for stdout
 * and one for stderr.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxBidirectionalSocket = commonInternal.demuxBidirectionalSocket;

/**
 * Demux either a raw stream socket or a multiplexed stream socket from stdin to
 * stdout and stderr. If given a raw stream socket, then stdout and stderr will
 * be combined on the same sink. If given a multiplexed stream socket, then
 * stdout and stderr will be forwarded to different sinks.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxSocketFromStdinToStdoutAndStderr = commonInternal.demuxSocketFromStdinToStdoutAndStderr;

/**
 * Demux either a raw stream socket or a multiplexed stream socket. It will send
 * the input stream to the container and will log all output to the console.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxSocketWithInputToConsole = commonInternal.demuxSocketWithInputToConsole;

/**
 * Demux a multiplexed socket. When given a multiplexed socket, we must parse
 * the chunks by headers and then forward each chunk based on its datatype to
 * the correct sink.
 *
 * When partitioning the stream into stdout and stderr, the first sink may
 * advance by up to bufferSize elements further than the slower one. The default
 * bufferSize is 16.
 *
 * @since 1.0.0
 * @category Demux
 * @see https://docs.docker.com/engine/api/v1.46/#tag/Container/operation/ContainerAttach
 */
export const demuxMultiplexedSocket = multiplexedInternal.demuxMultiplexedSocket;

/**
 * Demux a raw socket. When given a raw socket of the remote process's pty,
 * there is no way to differentiate between stdout and stderr so they are
 * combined on the same sink.
 *
 * To demux multiple raw sockets, you should use {@link demuxRawSockets}
 *
 * @since 1.0.0
 * @category Demux
 * @see https://docs.docker.com/engine/api/v1.46/#tag/Container/operation/ContainerAttach
 */
export const demuxBidirectionalRawSocket = rawInternal.demuxBidirectionalRawSocket;
