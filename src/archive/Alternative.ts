/**
 * Alternative methods of creating tar archives (so they don't get lost)
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
 * work in Node.js/Deno/Bun.
 *
 * @internal
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
