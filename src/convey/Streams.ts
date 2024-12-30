/**
 * Prepares streams for the Docker API.
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";
import * as Array from "effect/Array";
import * as Chunk from "effect/Chunk";
import * as Function from "effect/Function";
import * as HashMap from "effect/HashMap";
import * as ParseResult from "effect/ParseResult";
import * as Predicate from "effect/Predicate";
import * as Stream from "effect/Stream";

import { emptyBlock } from "../archive/Common.js";
import { padStream, tarballFromFilesystem, tarballFromMemory } from "../archive/Tar.js";

/**
 * @since 1.0.0
 * @category Conveyance Streams
 */
export const packIntoTarballStream: {
    (
        cwd: string,
        entries?: Array<string> | undefined
    ): Stream.Stream<
        Uint8Array,
        PlatformError.PlatformError | ParseResult.ParseError,
        Path.Path | FileSystem.FileSystem
    >;
    <E1 = never, R1 = never>(
        entries: HashMap.HashMap<
            string,
            string | Uint8Array | readonly [contentSize: number, stream: Stream.Stream<Uint8Array, E1, R1>]
        >
    ): Stream.Stream<Uint8Array, ParseResult.ParseError | E1, R1>;
} = <
    E1,
    R1,
    T extends
        | string
        | HashMap.HashMap<
              string,
              string | Uint8Array | readonly [contentSize: number, stream: Stream.Stream<Uint8Array, E1, R1>]
          >,
    U extends T extends string
        ? Stream.Stream<
              Uint8Array,
              PlatformError.PlatformError | ParseResult.ParseError,
              Path.Path | FileSystem.FileSystem
          >
        : Stream.Stream<Uint8Array, ParseResult.ParseError | E1, R1>,
>(
    cwdOrEntries: T,
    entries: Array<string> = ["dockerfile"]
): U =>
    Predicate.isString(cwdOrEntries)
        ? (tarballFromFilesystem(cwdOrEntries, entries) as U)
        : (tarballFromMemory(cwdOrEntries) as U);

/**
 * @since 1.0.0
 * @category Conveyance Streams
 */
export const mergeTarballs = <E1, R1>(
    tarballs: Array<Stream.Stream<Uint8Array, ParseResult.ParseError | E1, R1>>
): Stream.Stream<Uint8Array, ParseResult.ParseError | E1, R1> =>
    Function.pipe(
        tarballs,
        Array.map(padStream),
        Chunk.fromIterable,
        Stream.concatAll,
        Stream.concat(Stream.make(emptyBlock))
    );
