/**
 * Common request helpers
 *
 * @since 1.0.0
 */

import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as Array from "effect/Array";
import * as Function from "effect/Function";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Record from "effect/Record";
import * as Tuple from "effect/Tuple";

/**
 * Takes a key and an optional value and returns a function that either adds the
 * key and value to the query parameters of a request if the value was a Some or
 * does nothing if its a None.
 *
 * @since 1.0.0
 * @category Request Helpers
 * @internal
 */
export const maybeAddQueryParameter = (
    key: string,
    value: Option.Option<unknown>
): ((self: HttpClientRequest.HttpClientRequest) => HttpClientRequest.HttpClientRequest) =>
    Option.match({
        onNone: Function.constant(Function.identity),
        onSome: (val) => HttpClientRequest.setUrlParam(key, String(val)),
    })(value);

/**
 * Takes a key and an optional value and returns a function that either adds the
 * key and value to the headers of a request if the value was a Some or does
 * nothing if its a None.
 *
 * @since 1.0.0
 * @category Request Helpers
 * @internal
 */
export const maybeAddHeader = (
    key: string,
    value: Option.Option<string>
): ((self: HttpClientRequest.HttpClientRequest) => HttpClientRequest.HttpClientRequest) =>
    Option.match({
        onNone: Function.constant(Function.identity),
        onSome: (val: string) => HttpClientRequest.setHeader(key, val),
    })(value);

/**
 * For a given set of filters, returns a function that adds the filters to the
 * http request as a query parameter.
 *
 * @since 1.0.0
 * @category Request Helpers
 * @internal
 */
export const maybeAddFilters = (
    filters?: Record<string, Record<string, string> | string | number | boolean | undefined | null> | undefined
): ((self: HttpClientRequest.HttpClientRequest) => HttpClientRequest.HttpClientRequest) =>
    maybeAddQueryParameter(
        "filters",
        Function.pipe(
            filters,
            Option.fromNullable,
            Option.map(
                Record.map((val) => (Predicate.isNullable(val) ? Array.empty : Tuple.make(JSON.stringify(val))))
            ),
            Option.map(JSON.stringify)
        )
    );
