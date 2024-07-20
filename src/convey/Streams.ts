/**
 * Prepares streams for the Docker API.
 *
 * @since 1.0.0
 */

import * as Stream from "effect/Stream";
import * as tar from "tar-fs";

import * as Images from "../endpoints/Images.js";

/**
 * Packs the context into a tarball stream to use with the build endpoint.
 *
 * @since 1.0.0
 */
export const packBuildContextIntoTarballStream = (
    cwd: string,
    entries: Array<string> = ["dockerfile"]
): Stream.Stream<Uint8Array, Images.ImagesError, never> =>
    Stream.fromAsyncIterable(
        tar.pack(cwd, { entries }),
        (error) => new Images.ImagesError({ method: "buildStream", cause: error })
    );
