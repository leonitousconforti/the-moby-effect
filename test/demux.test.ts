import { Effect, Stream, Sink } from "effect";

import { describe, expect, it } from "@effect/vitest";
import { MobyDemux } from "the-moby-effect";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const collectText: Sink.Sink<string, string> = Sink.reduce(
    () => "",
    (acc: string, chunk: string) => acc + chunk
);

const freshRaws = () => ({
    stdout: MobyDemux.rawFromStream(Stream.make(encoder.encode("hello stdout"))),
    stderr: MobyDemux.rawFromStream(Stream.make(encoder.encode("hello stderr"))),
});

// One multiplexed frame: an 8 byte header (type byte, three zero bytes, then
// the payload size in big-endian order) followed by the payload.
const frame = (type: MobyDemux.MultiplexedHeaderType, payload: string): Uint8Array => {
    const encoded = encoder.encode(payload);
    const result = new Uint8Array(8 + encoded.length);
    result[0] = type;
    new DataView(result.buffer).setUint32(4, encoded.length);
    result.set(encoded, 8);
    return result;
};

const concatBytes = (...arrays: Array<Uint8Array>): Uint8Array => {
    const result = new Uint8Array(arrays.reduce((total, array) => total + array.length, 0));
    let offset = 0;
    for (const array of arrays) {
        result.set(array, offset);
        offset += array.length;
    }
    return result;
};

describe("MobyDemux", () => {
    describe("Raw", () => {
        it.live("demuxRawToSingleSink should collect the raw output", () =>
            Effect.gen(function* () {
                const raw = MobyDemux.rawFromStream(Stream.make(encoder.encode("raw bytes")));
                const text = yield* MobyDemux.demuxRawToSingleSink(raw, Stream.empty, collectText);
                expect(text).toBe("raw bytes");
            })
        );

        it.live("rawToStream should surface the raw bytes", () =>
            Effect.gen(function* () {
                const raw = MobyDemux.rawFromStream(Stream.make(encoder.encode("raw bytes")));
                const text = yield* MobyDemux.rawToStream(raw).pipe(Stream.decodeText(), Stream.run(collectText));
                expect(text).toBe("raw bytes");
            })
        );

        it.live("demuxStdioRawToSeparateSinks should route stdout and stderr to their own sinks", () =>
            Effect.gen(function* () {
                const [stdoutText, stderrText] = yield* MobyDemux.demuxStdioRawToSeparateSinks(freshRaws(), {
                    stdin: Stream.empty,
                    stdout: collectText,
                    stderr: collectText,
                });
                expect(stdoutText).toBe("hello stdout");
                expect(stderrText).toBe("hello stderr");
            })
        );

        it.live("demuxStdioRawToSingleSink should combine stdout and stderr into one sink", () =>
            Effect.gen(function* () {
                const text = yield* MobyDemux.demuxStdioRawToSingleSink(freshRaws(), Stream.empty, collectText);
                expect(text).toContain("hello stdout");
                expect(text).toContain("hello stderr");
            })
        );

        it.live("mergeRawToTaggedStream should tag output by stream", () =>
            Effect.gen(function* () {
                const { stderr, stdout } = freshRaws();
                const tagged = yield* MobyDemux.mergeRawToTaggedStream(stdout, stderr).pipe(Stream.run(Sink.collect()));

                const stdoutText = tagged
                    .filter(({ _tag }) => _tag === "stdout")
                    .map(({ value }) => decoder.decode(value))
                    .join("");
                const stderrText = tagged
                    .filter(({ _tag }) => _tag === "stderr")
                    .map(({ value }) => decoder.decode(value))
                    .join("");

                expect(stdoutText).toBe("hello stdout");
                expect(stderrText).toBe("hello stderr");
            })
        );
    });

    describe("Multiplexed", () => {
        it.live("demuxMultiplexedToSingleSink should reassemble frames split across chunk boundaries", () =>
            Effect.gen(function* () {
                const bytes = concatBytes(
                    frame(MobyDemux.MultiplexedHeaderType.Stdout, "out1"),
                    frame(MobyDemux.MultiplexedHeaderType.Stderr, "err1"),
                    frame(MobyDemux.MultiplexedHeaderType.Stdout, "out2")
                );

                // Split the frames at boundaries that never line up with the
                // 8 byte headers to exercise the header accumulator.
                const chunks: Array<Uint8Array> = [];
                for (let index = 0; index < bytes.length; index += 5) {
                    chunks.push(bytes.slice(index, index + 5));
                }

                const multiplexed = MobyDemux.multiplexedFromStream(Stream.fromIterable(chunks));
                const frames = yield* MobyDemux.demuxMultiplexedToSingleSink(
                    multiplexed,
                    Stream.empty,
                    Sink.collect<readonly [MobyDemux.MultiplexedHeaderType, string]>()
                );

                expect(frames).toEqual([
                    [MobyDemux.MultiplexedHeaderType.Stdout, "out1"],
                    [MobyDemux.MultiplexedHeaderType.Stderr, "err1"],
                    [MobyDemux.MultiplexedHeaderType.Stdout, "out2"],
                ]);
            })
        );

        it.live("demuxMultiplexedToSeparateSinks should split streams by header type", () =>
            Effect.gen(function* () {
                const bytes = concatBytes(
                    frame(MobyDemux.MultiplexedHeaderType.Stdout, "out1"),
                    frame(MobyDemux.MultiplexedHeaderType.Stderr, "err1"),
                    frame(MobyDemux.MultiplexedHeaderType.Stdout, "out2")
                );

                const multiplexed = MobyDemux.multiplexedFromStream(Stream.make(bytes));
                const [stdoutText, stderrText] = yield* MobyDemux.demuxMultiplexedToSeparateSinks(
                    multiplexed,
                    Stream.empty,
                    collectText,
                    collectText
                );

                expect(stdoutText).toBe("out1out2");
                expect(stderrText).toBe("err1");
            })
        );
    });

    describe("Packing and fanning", () => {
        it.live("pack should frame raw stdio into a multiplexed channel", () =>
            Effect.gen(function* () {
                const multiplexed = yield* MobyDemux.pack(freshRaws(), { requestedCapacity: 16 });
                const [stdoutText, stderrText] = yield* MobyDemux.demuxMultiplexedToSeparateSinks(
                    multiplexed,
                    Stream.empty,
                    collectText,
                    collectText
                );
                expect(stdoutText).toBe("hello stdout");
                expect(stderrText).toBe("hello stderr");
            })
        );

        it.live("fan should separate a multiplexed channel back into raw channels", () =>
            Effect.gen(function* () {
                const multiplexed = yield* MobyDemux.pack(freshRaws(), { requestedCapacity: 16 });
                const fanned = yield* MobyDemux.fan(multiplexed, { requestedCapacity: 16 });

                const [stdoutText, stderrText] = yield* Effect.all(
                    [
                        MobyDemux.rawToStream(fanned.stdout).pipe(Stream.decodeText(), Stream.run(collectText)),
                        MobyDemux.rawToStream(fanned.stderr).pipe(Stream.decodeText(), Stream.run(collectText)),
                    ],
                    { concurrency: 2 }
                );

                expect(stdoutText).toBe("hello stdout");
                expect(stderrText).toBe("hello stderr");
            })
        );
    });
});
