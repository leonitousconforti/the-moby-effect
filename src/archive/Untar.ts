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
 * @since 1.0.0
 * @category Untar
 */
export const collectorSink: Sink.Sink<
    HashMap.HashMap<TarCommon.TarHeader, FolderState>,
    FolderState,
    never,
    never,
    never
> = Sink.collectAllToMap<FolderState, TarCommon.TarHeader>(
    (input) => input.headerBlock!,
    (a, b) => b
);

/**
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
        Stream.run(collectorSink),
        Effect.map(HashMap.map(({ dataStream }) => dataStream))
    );
