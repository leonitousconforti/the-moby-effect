import * as Option from "effect/Option";
import * as ParseResult from "effect/ParseResult";
import * as Schema from "effect/Schema";
import * as String from "effect/String";
import * as TypesPluginInterfaceType from "./TypesPluginInterfaceType.generated.js";

export class TypesPluginConfigInterface extends Schema.Class<TypesPluginConfigInterface>("TypesPluginConfigInterface")(
    {
        ProtocolScheme: Schema.optional(Schema.String),
        Socket: Schema.String,
        Types: Schema.NullOr(
            Schema.Array(
                Schema.transformOrFail(
                    Schema.TemplateLiteral(Schema.String, ".", Schema.String, "/", Schema.String),
                    TypesPluginInterfaceType.TypesPluginInterfaceType,
                    {
                        encode: ({ Capability, Prefix, Version }) =>
                            ParseResult.succeed(`${Prefix}.${Capability}/${Version}` as const),
                        decode: (asString, _options, ast) => {
                            const PrefixCapabilitySplit = String.indexOf(".")(asString);
                            const CapabilityVersionSplit = String.lastIndexOf("/")(asString);

                            if (Option.isNone(PrefixCapabilitySplit) || Option.isNone(CapabilityVersionSplit)) {
                                return ParseResult.fail(new ParseResult.Type(ast, asString, "Invalid format"));
                            }

                            return ParseResult.succeed({
                                Prefix: String.substring(0, PrefixCapabilitySplit.value)(asString),
                                Version: String.substring(CapabilityVersionSplit.value + 1)(asString),
                                Capability: String.substring(
                                    PrefixCapabilitySplit.value + 1,
                                    CapabilityVersionSplit.value
                                )(asString),
                            });
                        },
                    }
                )
            )
        ),
    },
    {
        identifier: "TypesPluginConfigInterface",
        title: "types.PluginConfigInterface",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#PluginConfigInterface",
    }
) {}
