/**
 * GNU ustar untar implementation.
 *
 * @since 1.0.0
 */

import * as ParseResult from "@effect/schema/ParseResult";
import * as Chunk from "effect/Chunk";
import * as Duration from "effect/Duration";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as HashMap from "effect/HashMap";
import * as Predicate from "effect/Predicate";
import * as Schedule from "effect/Schedule";
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";

import * as TarCommon from "./Common.js";

/**
 * @since 1.0.0
 * @category Untar
 * @internal
 */
export type FolderState = {
    readonly dataBlocksRead: number;
    readonly dataBlocksExpected: number;
    readonly endOfArchiveFlag: boolean;
    readonly headerBlock: TarCommon.TarHeader | undefined;
    readonly dataStream: Stream.Stream<Uint8Array, never, never>;
};

/**
 * This sink will read blocks from the stream and will combine the data blocks
 * for this header block into a single stream. This sink will stop once it has
 * read all the data block for this header block or once it see the endOfArchive
 * flag.
 *
 * @since 1.0.0
 * @category Untar
 */
export const aggregateBlocksByHeadersSink: Sink.Sink<
    FolderState,
    Uint8Array,
    Uint8Array,
    ParseResult.ParseError,
    never
> = Sink.foldWeightedEffect({
    maxCost: Number(false),
    initial: {
        dataBlocksRead: 0,
        dataBlocksExpected: 1,
        endOfArchiveFlag: false as boolean,
        dataStream: Stream.fromChunk(Chunk.empty<Uint8Array>()),
        headerBlock: undefined as TarCommon.TarHeader | undefined,
    },
    cost: (state, _input) =>
        Effect.succeed(Number(state.dataBlocksRead >= state.dataBlocksExpected) + Number(state.endOfArchiveFlag)),
    body: (state, input) =>
        Effect.gen(function* () {
            /**
             * If the header has not been parsed yet and we come across an empty
             * block, then this must be the end of the archive
             */
            if (Predicate.isUndefined(state.headerBlock) && TarCommon.isEmptyBlock(input)) {
                return { ...state, endOfArchiveFlag: true };
            }

            /**
             * If the header has not been parsed yet and we did not come across
             * an empty block, then we must parse the header and set how many
             * data blocks we are expecting
             */
            if (Predicate.isUndefined(state.headerBlock)) {
                const headerBlock = yield* TarCommon.TarHeader.read(input);
                const dataBlocksExpected = Math.ceil(headerBlock.fileSize / TarCommon.BLOCK_SIZE);
                return { ...state, headerBlock, dataBlocksExpected };
            }

            /**
             * If we have already parsed the header, then keep appending data
             * blocks
             */
            return {
                ...state,
                dataBlocksRead: state.dataBlocksRead + 1,
                dataStream: Stream.concat(state.dataStream, Stream.make(input)),
            };
        }),
});

/**
 * When the stream is done, we will have a bunch of FolderState objects which
 * container their header blocks and data streams. We will collect them all into
 * a map, where the key is the Tar header block and the value is the data
 * stream. If we encounter two of the exact same header blocks in our stream,
 * then we will just take the second one.
 *
 * @since 1.0.0
 * @category Untar
 */
export const collectorSink: Sink.Sink<
    HashMap.HashMap<TarCommon.TarHeader, Stream.Stream<Uint8Array, never, never>>,
    FolderState,
    never,
    never,
    never
> = Sink.map(
    Sink.collectAllToMap<FolderState, TarCommon.TarHeader>(
        (input) => input.headerBlock!,
        (_a, b) => b
    ),
    HashMap.map(({ dataStream }) => dataStream)
);

/**
 * Takes a Tar stream and unpacks it into a map of Tar headers and their data
 * streams.
 *
 * @since 1.0.0
 * @category Untar
 */
export const Untar = <E1, R1>(
    stream: Stream.Stream<Uint8Array, E1, R1>
): Effect.Effect<
    HashMap.HashMap<TarCommon.TarHeader, Stream.Stream<Uint8Array, never, never>>,
    E1 | ParseResult.ParseError,
    Exclude<R1, Scope.Scope>
> =>
    Function.pipe(
        stream,
        Stream.mapConcat(Function.identity),
        Stream.grouped(TarCommon.BLOCK_SIZE),
        Stream.map((chunk) => Uint8Array.from(chunk)),
        Stream.aggregateWithin(aggregateBlocksByHeadersSink, Schedule.fixed(Duration.infinity)),
        Stream.takeWhile(({ endOfArchiveFlag }) => endOfArchiveFlag === false),
        Stream.run(collectorSink)
    );
