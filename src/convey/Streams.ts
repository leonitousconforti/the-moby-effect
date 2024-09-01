/**
 * Prepares streams for the Docker API.
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Effect from "effect/Effect";
import * as HashMap from "effect/HashMap";
import * as Predicate from "effect/Predicate";
import * as Stream from "effect/Stream";

import * as Tar from "../archive/Tar.js";

/**
 * @since 1.0.0
 * @category Conveyance Streams
 */
export const packBuildContextIntoTarballStream: {
    (
        cwd: string,
        entries?: Array<string> | undefined
    ): Effect.Effect<
        Stream.Stream<Uint8Array, PlatformError.PlatformError | ParseResult.ParseError, never>,
        PlatformError.PlatformError,
        Path.Path | FileSystem.FileSystem
    >;
    (entries: HashMap.HashMap<string, string | Uint8Array>): Stream.Stream<Uint8Array, ParseResult.ParseError, never>;
} = (cwdOrEntries: string | HashMap.HashMap<string, string | Uint8Array>, entries: Array<string> = ["dockerfile"]) => {
    if (Predicate.isString(cwdOrEntries)) {
        return Tar.TarballFromFilesystem(cwdOrEntries, entries) as any;
    } else {
        return Tar.TarballFromMemory(cwdOrEntries) as any;
    }
};
