import * as ParseResult from "@effect/schema/ParseResult";
import * as Array from "effect/Array";
import * as Chunk from "effect/Chunk";
import * as Function from "effect/Function";
import * as HashMap from "effect/HashMap";
import * as Match from "effect/Match";
import * as Predicate from "effect/Predicate";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

import * as TarCommon from "./Common.js";

/**
 * @since 1.0.0
 * @category Tar
 * @internal
 */
export const convertSingleEntry = <E1, R1>(
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
        onSecond: Function.pipe(
            Match.type<string | Uint8Array | Stream.Stream<Uint8Array, E1, R1>>(),
            Match.when(Predicate.isUint8Array, (arr) => Stream.make(arr)),
            Match.when(Predicate.isString, (str) => Stream.make(TarCommon.textEncoder.encode(str))),
            Match.orElse(Function.identity<Stream.Stream<Uint8Array, E1, R1>>)
        ),
    });

/**
 * @since 1.0.0
 * @category Tar
 */
export const Tar = <E1 = never, R1 = never>(
    entries: HashMap.HashMap<TarCommon.TarHeader, string | Uint8Array | Stream.Stream<Uint8Array, E1, R1>>
): Stream.Stream<Uint8Array, ParseResult.ParseError | E1, R1> =>
    Function.pipe(entries, HashMap.toEntries, Array.flatMap(convertSingleEntry), Chunk.fromIterable, Stream.concatAll);
