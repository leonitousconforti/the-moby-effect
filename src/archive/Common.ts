/**
 * Shared GNU ustar tar details.
 *
 * @since 1.0.0
 */

import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Number from "effect/Number";
import * as ParseResult from "effect/ParseResult";
import * as Schema from "effect/Schema";

/** @internal */
export const BLOCK_SIZE = 512;

/** @internal */
export const emptyBlock = Uint8Array.from(Buffer.alloc(BLOCK_SIZE));

/** @internal */
export const isEmptyBlock = (block: Uint8Array) => Buffer.compare(block, emptyBlock) === 0;

/** @internal */
export const textDecoder = new TextDecoder("utf-8");

/** @internal */
export const textEncoder = new TextEncoder();

/**
 * @since 1.0.0
 * @category Schemas
 */
export enum FileTypes {
    "file" = 0,
    "link" = 1,
    "symlink" = 2,
    "character-device" = 3,
    "block-device" = 4,
    "directory" = 5,
    "fifo" = 6,
    "contiguous-file" = 7,
}

/**
 * @since 1.0.0
 * @category Schemas
 */
export class TarHeader extends Schema.Class<TarHeader>("TarHeader")({
    filename: Schema.String.pipe(Schema.maxLength(100)),
    fileSize: Function.pipe(
        Schema.String,
        Schema.maxLength(12),
        Schema.compose(Schema.NumberFromString),
        Schema.transform(Schema.Number, {
            strict: true,
            decode: (n) => parseInt(n.toString(), 8),
            encode: (n) => parseInt(n.toString(8)),
        })
    ),

    linkName: Function.pipe(
        Schema.String,
        Schema.maxLength(100),
        Schema.propertySignature,
        Schema.withConstructorDefault(() => "")
    ),
    filenamePrefix: Function.pipe(
        Schema.String,
        Schema.maxLength(155),
        Schema.propertySignature,
        Schema.withConstructorDefault(() => "")
    ),

    /**
     * The underlying raw `st_mode` bits that contain the standard Unix
     * permissions for this file/directory.
     */
    fileMode: Function.pipe(
        Schema.String,
        Schema.maxLength(8),
        Schema.propertySignature,
        Schema.withConstructorDefault(() => "644")
    ),

    /**
     * Data modification time of the file at the time it was archived. It
     * represents the integer number of seconds since January 1, 1970,
     * 00:00-UTC.
     */
    mtime: Function.pipe(
        Schema.String,
        Schema.maxLength(12),
        Schema.compose(Schema.NumberFromString),
        Schema.transform(Schema.Number, {
            strict: true,
            decode: (n) => parseInt(n.toString(), 8),
            encode: (n) => parseInt(n.toString(8)),
        }),
        Schema.transform(Schema.Number, {
            strict: true,
            decode: Number.multiply(1000),
            encode: Number.unsafeDivide(1000),
        }),
        Schema.compose(Schema.DateFromNumber),
        Schema.propertySignature,
        Schema.withConstructorDefault(() => new Date())
    ),

    /**
     * Numeric user ID of the file owner. This is ignored if the operating
     * system does not support numeric user IDs.
     */
    uid: Function.pipe(
        Schema.String,
        Schema.maxLength(8),
        Schema.compose(Schema.NumberFromString),
        Schema.propertySignature,
        Schema.withConstructorDefault(() => 0)
    ),

    /**
     * Numeric group ID of the file owner. This is ignored if the operating
     * system does not support numeric group IDs.
     */
    gid: Function.pipe(
        Schema.String,
        Schema.maxLength(8),
        Schema.compose(Schema.NumberFromString),
        Schema.propertySignature,
        Schema.withConstructorDefault(() => 0)
    ),

    /** The name of the file owner, can be at most 12 bytes long. */
    owner: Function.pipe(
        Schema.String,
        Schema.maxLength(32),
        Schema.propertySignature,
        Schema.withConstructorDefault(() => "")
    ),

    /** The group that the file owner belongs to, can be at most 12 bytes long. */
    group: Function.pipe(
        Schema.String,
        Schema.maxLength(32),
        Schema.propertySignature,
        Schema.withConstructorDefault(() => "")
    ),

    /** The type of file archived. */
    type: Function.pipe(
        Schema.String,
        Schema.maxLength(1),
        Schema.compose(Schema.NumberFromString),
        Schema.transform(Schema.Enums(FileTypes), {
            strict: true,
            encode: Function.identity,
            decode: Function.identity,
        }),
        Schema.propertySignature,
        Schema.withConstructorDefault(() => FileTypes.file)
    ),

    /** Major number. */
    deviceMajorNumber: Function.pipe(
        Schema.String,
        Schema.maxLength(8),
        Schema.propertySignature,
        Schema.withConstructorDefault(() => "")
    ),

    /** Minor number. */
    deviceMinorNumber: Function.pipe(
        Schema.String,
        Schema.maxLength(8),
        Schema.propertySignature,
        Schema.withConstructorDefault(() => "")
    ),
}) {
    /**
     * Extra things to decode that don't need to be exposed.
     *
     * TODO: Maybe look into implementing this with schema variants?
     */
    private static FullTarHeaderBlock = class FullTarHeaderBlock extends TarHeader.extend<FullTarHeaderBlock>(
        "FullTarHeaderBlock"
    )({
        checksum: Schema.NumberFromString,
        ustar: Schema.Literal("ustar\x20\x20\x00" as string, "ustar\x0000" as string),
        padding: Schema.Literal("\0".repeat(12)),
    }) {};

    /** @since 1.0.0 */
    public static read = (source: Uint8Array): Effect.Effect<TarHeader, ParseResult.ParseError, never> => {
        const asString = textDecoder.decode(source);
        const fullHeader = Schema.decode(TarHeader.FullTarHeaderBlock)({
            filename: asString.substring(0, 100).replaceAll("\0", ""),
            fileMode: asString.substring(100, 108).replaceAll("\0", ""),
            uid: asString.substring(108, 116).replaceAll("\0", ""),
            gid: asString.substring(116, 124).replaceAll("\0", ""),
            fileSize: asString.substring(124, 136).replaceAll("\0", ""),
            mtime: asString.substring(136, 148).replaceAll("\0", ""),
            checksum: asString.substring(148, 156).replaceAll("\0", ""),
            type: asString.substring(156, 157),
            linkName: asString.substring(157, 257).replaceAll("\0", ""),
            ustar: asString.substring(257, 265),
            owner: asString.substring(265, 297).replaceAll("\0", ""),
            group: asString.substring(297, 329).replaceAll("\0", ""),
            deviceMajorNumber: asString.substring(329, 337).replaceAll("\0", ""),
            deviceMinorNumber: asString.substring(337, 345).replaceAll("\0", ""),
            filenamePrefix: asString.substring(345, 500).replaceAll("\0", ""),
            padding: asString.substring(500, 512),
        });
        return Effect.map(fullHeader, ({ checksum: _checksum, padding: _padding, ustar: _ustar, ...rest }) => rest);
    };

    /** @since 1.0.0 */
    public write = (): Effect.Effect<Uint8Array, ParseResult.ParseError, never> =>
        Effect.gen(this, function* () {
            const uint8Array = new Uint8Array(BLOCK_SIZE);
            const self = yield* Schema.encode(TarHeader)(this);
            uint8Array.set(textEncoder.encode(self.filename), 0);
            uint8Array.set(textEncoder.encode(self.fileMode.padStart(7, "0")), 100);
            uint8Array.set(textEncoder.encode(self.uid.padStart(7, "0")), 108);
            uint8Array.set(textEncoder.encode(self.gid.padStart(7, "0")), 116);
            uint8Array.set(textEncoder.encode(self.fileSize.toString().padStart(11, "0")), 124);
            uint8Array.set(textEncoder.encode(self.mtime.padStart(11, "0")), 136);
            uint8Array.set(textEncoder.encode("\x20\x20\x20\x20\x20\x20\x20\x20"), 148);
            uint8Array.set(textEncoder.encode(self.type.toString()), 156);
            uint8Array.set(textEncoder.encode(self.filenamePrefix), 345);
            uint8Array.set(textEncoder.encode("ustar\x20\x20\x00"), 257);
            uint8Array.set(textEncoder.encode(self.owner), 265);
            uint8Array.set(textEncoder.encode(self.group), 297);
            uint8Array.set(textEncoder.encode(self.deviceMajorNumber), 329);
            uint8Array.set(textEncoder.encode(self.deviceMinorNumber), 337);
            uint8Array.set(textEncoder.encode("\0".repeat(12)), 500);
            const checksum = uint8Array.reduce((acc, curr) => acc + curr, 0);
            uint8Array.set(textEncoder.encode(checksum.toString(8).padStart(6, "0")), 148);
            uint8Array.set(textEncoder.encode("\0 "), 154);
            return uint8Array;
        });
}
