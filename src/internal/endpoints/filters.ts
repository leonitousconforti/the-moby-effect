import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import * as SchemaGetter from "effect/SchemaGetter";
import * as SchemaIssue from "effect/SchemaIssue";

/**
 * Docker parses the values of a filters query parameter as map[string][]string
 * (or the legacy map[string]map[string]bool), so scalar filter values must
 * encode as single-element arrays - a bare string, number, or boolean value is
 * rejected by the daemon with a 400.
 *
 * @internal
 */
export const StringFilter = Schema.Tuple([Schema.String]).pipe(
    Schema.decodeTo(Schema.String, {
        decode: SchemaGetter.transform(([value]: readonly [string]) => value),
        encode: SchemaGetter.transform((value: string) => [value] as const),
    })
);

/** @internal */
export const NumberFilter = Schema.Tuple([Schema.NumberFromString]).pipe(
    Schema.decodeTo(Schema.Number, {
        decode: SchemaGetter.transform(([value]: readonly [number]) => value),
        encode: SchemaGetter.transform((value: number) => [value] as const),
    })
);

/** @internal */
export const BooleanFilter = (filterName: string) =>
    Schema.Tuple([Schema.String]).pipe(
        Schema.decodeTo(Schema.Boolean, {
            decode: SchemaGetter.transformOrFail((fromA: readonly [string]) =>
                Effect.fail(
                    new SchemaIssue.InvalidValue(Option.some(fromA), {
                        message: `Decoding '${filterName}' filter is not supported`,
                    })
                )
            ),
            encode: SchemaGetter.transform((bool: boolean) => [bool ? "true" : "false"] as const),
        })
    );
