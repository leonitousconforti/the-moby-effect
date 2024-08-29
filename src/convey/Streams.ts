/**
 * Prepares streams for the Docker API.
 *
 * @since 1.0.0
 */

import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Option from "effect/Option";
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
): Stream.Stream<Uint8Array, Images.ImagesError, never> =>
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

Stream.unfold(new Uint8Array(), (buffer) => Option.none());

// struct posix_header {          // byte offset
// 	char name[100];               // 0
// 	char mode[8];                 // 100
// 	char uid[8];                  // 108
// 	char gid[8];                  // 116
// 	char size[12];                // 124
// 	char mtime[12];               // 136
// 	char chksum[8];               // 148
// 	char typeflag;                // 156
// 	char linkname[100];           // 157
// 	char magic[6];                // 257
// 	char version[2];              // 263
// 	char uname[32];               // 265
// 	char gname[32];               // 297
// 	char devmajor[8];             // 329
// 	char devminor[8];             // 337
// 	char prefix[155];             // 345
//                                // 500
// };
