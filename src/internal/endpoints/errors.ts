import * as Schema from "effect/Schema";

/** @since 1.0.0 */
export class BadRequest extends Schema.Error<BadRequest>("BadRequest")(
    {
        _tag: Schema.tagDefaultOmit("BadRequest"),
        message: Schema.optionalKey(Schema.String),
    },
    {
        identifier: "BadRequest",
        description: "BadRequest",
        httpApiStatus: 400,
    }
) {}

/** @since 1.0.0 */
export class Unauthorized extends Schema.Error<Unauthorized>("Unauthorized")(
    {
        _tag: Schema.tagDefaultOmit("Unauthorized"),
        message: Schema.optionalKey(Schema.String),
    },
    {
        identifier: "Unauthorized",
        description: "Unauthorized",
        httpApiStatus: 401,
    }
) {}

/** @since 1.0.0 */
export class Forbidden extends Schema.Error<Forbidden>("Forbidden")(
    {
        _tag: Schema.tagDefaultOmit("Forbidden"),
        message: Schema.optionalKey(Schema.String),
    },
    {
        identifier: "Forbidden",
        description: "Forbidden",
        httpApiStatus: 403,
    }
) {}

/** @since 1.0.0 */
export class NotFound extends Schema.Error<NotFound>("NotFound")(
    {
        _tag: Schema.tagDefaultOmit("NotFound"),
        message: Schema.optionalKey(Schema.String),
    },
    {
        identifier: "NotFound",
        description: "NotFound",
        httpApiStatus: 404,
    }
) {}

/** @since 1.0.0 */
export class MethodNotAllowed extends Schema.Error<MethodNotAllowed>("MethodNotAllowed")(
    {
        _tag: Schema.tagDefaultOmit("MethodNotAllowed"),
        message: Schema.optionalKey(Schema.String),
    },
    {
        identifier: "MethodNotAllowed",
        description: "MethodNotAllowed",
        httpApiStatus: 405,
    }
) {}

/** @since 1.0.0 */
export class NotAcceptable extends Schema.Error<NotAcceptable>("NotAcceptable")(
    {
        _tag: Schema.tagDefaultOmit("NotAcceptable"),
        message: Schema.optionalKey(Schema.String),
    },
    {
        identifier: "NotAcceptable",
        description: "NotAcceptable",
        httpApiStatus: 406,
    }
) {}

/** @since 1.0.0 */
export class RequestTimeout extends Schema.Error<RequestTimeout>("RequestTimeout")(
    {
        _tag: Schema.tagDefaultOmit("RequestTimeout"),
        message: Schema.optionalKey(Schema.String),
    },
    {
        identifier: "RequestTimeout",
        description: "RequestTimeout",
        httpApiStatus: 408,
    }
) {}

/** @since 1.0.0 */
export class Conflict extends Schema.Error<Conflict>("Conflict")(
    {
        _tag: Schema.tagDefaultOmit("Conflict"),
        message: Schema.optionalKey(Schema.String),
    },
    {
        identifier: "Conflict",
        description: "Conflict",
        httpApiStatus: 409,
    }
) {}

/** @since 1.0.0 */
export class Gone extends Schema.Error<Gone>("Gone")(
    {
        _tag: Schema.tagDefaultOmit("Gone"),
        message: Schema.optionalKey(Schema.String),
    },
    {
        identifier: "Gone",
        description: "Gone",
        httpApiStatus: 410,
    }
) {}

/** @since 1.0.0 */
export class UnprocessableEntity extends Schema.Error<UnprocessableEntity>("UnprocessableEntity")(
    {
        _tag: Schema.tagDefaultOmit("UnprocessableEntity"),
        message: Schema.optionalKey(Schema.String),
    },
    {
        identifier: "UnprocessableEntity",
        description: "UnprocessableEntity",
        httpApiStatus: 422,
    }
) {}

/** @since 1.0.0 */
export class InternalServerError extends Schema.Error<InternalServerError>("InternalServerError")(
    {
        _tag: Schema.tagDefaultOmit("InternalServerError"),
        message: Schema.optionalKey(Schema.String),
    },
    {
        identifier: "InternalServerError",
        description: "InternalServerError",
        httpApiStatus: 500,
    }
) {}

/** @since 1.0.0 */
export class NotImplemented extends Schema.Error<NotImplemented>("NotImplemented")(
    {
        _tag: Schema.tagDefaultOmit("NotImplemented"),
        message: Schema.optionalKey(Schema.String),
    },
    {
        identifier: "NotImplemented",
        description: "NotImplemented",
        httpApiStatus: 501,
    }
) {}

/** @since 1.0.0 */
export class ServiceUnavailable extends Schema.Error<ServiceUnavailable>("ServiceUnavailable")(
    {
        _tag: Schema.tagDefaultOmit("ServiceUnavailable"),
        message: Schema.optionalKey(Schema.String),
    },
    {
        identifier: "ServiceUnavailable",
        description: "ServiceUnavailable",
        httpApiStatus: 503,
    }
) {}
