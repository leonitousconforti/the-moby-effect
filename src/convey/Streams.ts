/**
 * Prepares streams for the Docker API.
 *
 * @since 1.0.0
 */

import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Stream from "effect/Stream";

import * as Images from "../endpoints/Images.js";

/**
 * Packs the context into a tarball stream to use with the build endpoint using
 * the tar-fs npm package. Because we read from the filesystem, this will only
 * work in Node.js/Deno/Bun. If you need to pack a build context in the browser,
 * see {@link packBuildContextIntoTarballStreamWeb}.
 *
 * @since 1.0.0
 * @category Conveyance Streams
 */
export const packBuildContextIntoTarballStreamServer = (
    cwd: string,
    entries: Array<string> = ["dockerfile"]
): [unknown] extends [typeof import("tar-fs")]
    ? "Missing tar-fs package"
    : Stream.Stream<Uint8Array, Images.ImagesError, never> =>
    Function.pipe(
        Effect.promise(() => import("tar-fs")),
        Effect.map((tar) =>
            Stream.fromAsyncIterable(
                tar.pack(cwd, { entries }),
                (error) => new Images.ImagesError({ method: "buildStream", cause: error })
            )
        ),
        Stream.unwrap
    );

/**
 * Packs the context into a tarball stream to use with the build endpoint using
 * an in-memory implementation. This is useful for the browser, where we don't
 * have access to the filesystem.
 *
 * @since 1.0.0
 * @category Conveyance Streams
 */
export const packBuildContextIntoTarballStreamWeb = (
    entries: Record<string, string | Uint8Array>
): Stream.Stream<Uint8Array, Images.ImagesError, never> => Stream.never as any;
