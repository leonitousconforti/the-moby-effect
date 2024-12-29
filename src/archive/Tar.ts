/**
 * GNU ustar tar implementation.
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";
import * as Array from "effect/Array";
import * as Chunk from "effect/Chunk";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as HashMap from "effect/HashMap";
import * as Match from "effect/Match";
import * as Option from "effect/Option";
import * as ParseResult from "effect/ParseResult";
import * as Predicate from "effect/Predicate";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

import * as TarCommon from "./Common.js";

/** @internal */
const padUint8Array = (arr: Uint8Array): Uint8Array => {
    if (arr.length % TarCommon.BLOCK_SIZE === 0) return arr;
    const newSize = (Math.floor(arr.length / TarCommon.BLOCK_SIZE) + 1) * TarCommon.BLOCK_SIZE;
    const newArray = new Uint8Array(newSize);
    newArray.set(arr, 0);
    return newArray;
};

/** @internal */
const padStream = <E1, R1>(stream: Stream.Stream<Uint8Array, E1, R1>): Stream.Stream<Uint8Array, E1, R1> =>
    Function.pipe(
        stream,
        Stream.mapConcat(Function.identity),
        Stream.grouped(TarCommon.BLOCK_SIZE),
        Stream.map((chunk) => Uint8Array.from(chunk)),
        Stream.map(padUint8Array)
    );

/**
 * @since 1.0.0
 * @category Tar
 * @internal
 */
const convertSingleEntry = <E1, R1>(
    entry: readonly [
        tarHeaderEntry: TarCommon.TarHeader,
        fileContents: string | Uint8Array | Stream.Stream<Uint8Array, E1, R1>,
    ]
): readonly [
    tarEntryHeader: Stream.Stream<Uint8Array, ParseResult.ParseError, never>,
    tarEntryData: Stream.Stream<Uint8Array, ParseResult.ParseError | E1, R1>,
] =>
    Tuple.mapBoth(entry, {
        onFirst: (tarHeader) => Stream.fromEffect(tarHeader.write()),
        onSecond: (tarHeader) =>
            Function.pipe(
                Match.value(tarHeader),
                Match.when(Predicate.isUint8Array, (arr) => Stream.make(arr)),
                Match.when(Predicate.isString, (str) => Stream.make(TarCommon.textEncoder.encode(str))),
                Match.orElse(Function.identity<Stream.Stream<Uint8Array, E1, R1>>),
                padStream
            ),
    });

/**
 * @since 1.0.0
 * @category Tar
 */
export const Tarball = <E1 = never, R1 = never>(
    entries: HashMap.HashMap<TarCommon.TarHeader, string | Uint8Array | Stream.Stream<Uint8Array, E1, R1>>
): Stream.Stream<Uint8Array, ParseResult.ParseError | E1, R1> =>
    Function.pipe(
        entries,
        HashMap.toEntries,
        Array.flatMap(convertSingleEntry),
        Chunk.fromIterable,
        Stream.concatAll,
        Stream.concat(Stream.make(TarCommon.emptyBlock))
    );

/**
 * @since 1.0.0
 * @category Tar
 */
export const TarballFromMemory = <E1 = never, R1 = never>(
    entries: HashMap.HashMap<
        string,
        string | Uint8Array | readonly [contentSize: number, stream: Stream.Stream<Uint8Array, E1, R1>]
    >
): Stream.Stream<Uint8Array, ParseResult.ParseError | E1, R1> =>
    Function.pipe(
        entries,
        HashMap.toEntries,
        Array.map(([filename, data]) => {
            const contents = Function.pipe(
                Match.value(data),
                Match.when(Predicate.isString, (str) => str),
                Match.when(Predicate.isUint8Array, (bytes) => bytes),
                Match.orElse(([_, stream]) => stream)
            );

            const contentLength = Function.pipe(
                Match.value(data),
                Match.when(Predicate.isString, (str) => str.length),
                Match.when(Predicate.isUint8Array, (bytes) => bytes.length),
                Match.orElse(([size, _]) => size)
            );

            const header = TarCommon.TarHeader.make({
                filename,
                fileSize: contentLength,
            });

            return Tuple.make(header, contents);
        }),
        HashMap.fromIterable,
        Tarball
    );

/**
 * @since 1.0.0
 * @category Tar
 * @internal
 */
const tarEntryFromFilesystem = (
    filename: string,
    base: string
): Effect.Effect<
    readonly [header: TarCommon.TarHeader, contents: Stream.Stream<Uint8Array, PlatformError.PlatformError, never>],
    PlatformError.PlatformError,
    Path.Path | FileSystem.FileSystem
> =>
    Effect.gen(function* () {
        const path = yield* Path.Path;
        const filesystem = yield* FileSystem.FileSystem;
        const fullPath = path.join(base, filename);
        const contents = filesystem.stream(fullPath);
        const stat = yield* filesystem.stat(fullPath);
        const header = TarCommon.TarHeader.make({
            filename,
            fileSize: Number(stat.size),
            fileMode: "0" + (stat.mode & parseInt("777", 8)).toString(8),
            ...(Option.isSome(stat.uid) ? { uid: stat.uid.value } : {}),
            ...(Option.isSome(stat.gid) ? { gid: stat.gid.value } : {}),
            ...(Option.isSome(stat.mtime) ? { mtime: stat.mtime.value } : {}),
        });
        return Tuple.make(header, contents);
    });

/**
 * @since 1.0.0
 * @category Tar
 */
export const TarballFromFilesystem = (
    base: string,
    entries: Array<string>
): Stream.Stream<Uint8Array, PlatformError.PlatformError | ParseResult.ParseError, Path.Path | FileSystem.FileSystem> =>
    Function.pipe(
        entries,
        Array.map((file) => tarEntryFromFilesystem(file, base)),
        Effect.allWith({ concurrency: "unbounded" }),
        Effect.map(HashMap.fromIterable),
        Effect.map(Tarball),
        Stream.unwrap
    );
