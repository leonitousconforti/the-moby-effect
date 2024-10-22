/**
 * Prepares streams for the Docker API.
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";
import * as HashMap from "effect/HashMap";
import * as ParseResult from "effect/ParseResult";
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
    ): Stream.Stream<
        Uint8Array,
        PlatformError.PlatformError | ParseResult.ParseError,
        Path.Path | FileSystem.FileSystem
    >;
    (entries: HashMap.HashMap<string, string | Uint8Array>): Stream.Stream<Uint8Array, ParseResult.ParseError, never>;
} = <
    T extends string | HashMap.HashMap<string, string | Uint8Array>,
    U extends T extends string
        ? Stream.Stream<
              Uint8Array,
              PlatformError.PlatformError | ParseResult.ParseError,
              Path.Path | FileSystem.FileSystem
          >
        : Stream.Stream<Uint8Array, ParseResult.ParseError, never>,
>(
    cwdOrEntries: T,
    entries: Array<string> = ["dockerfile"]
): U =>
    Predicate.isString(cwdOrEntries)
        ? (Tar.TarballFromFilesystem(cwdOrEntries, entries) as U)
        : (Tar.TarballFromMemory(cwdOrEntries) as U);
