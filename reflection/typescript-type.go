package main

import (
	"bytes"
	"fmt"
	"io"
	"reflect"
	"regexp"
	"sort"
	"strings"
)

type TSType struct {
	StrRepresentation string
	Nullable          bool
}

type TSProperty struct {
	FieldName    string
	Type         TSType
	IsOpt        bool
	IsAnonymous  bool
	DefaultValue string
}

type TSModelType struct {
	GoSourceName string
	Properties   []TSProperty
}

// EmptyStruct is a type that represents a struct with no exported values.
var EmptyStruct = reflect.TypeOf(struct{}{})

// TSInboxTypesMap is a map from Go type kind to TS type.
var TSInboxTypesMap = map[reflect.Kind]TSType{
	// Numeric fields marshal as bare JSON numbers on the wire, but are carried
	// as strings between the agnostic http client and the schemas so 64-bit
	// values decode losslessly (see src/internal/schemas/number.ts).
	reflect.Float32: {"MobyNumber.NumberFromWireString", false},
	reflect.Float64: {"MobyNumber.NumberFromWireString", false},
	reflect.String:  {"Schema.String", false},
	reflect.Bool:    {"Schema.Boolean", false},

	// In practice most clients are 64bit so in go Int will be too.
	reflect.Int:   {"MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))", false},
	reflect.Int8:  {"MobyNumber.NumberFromWireString.check(Schema.isInt(), Schema.isBetween({ minimum: -(2 ** 7), maximum: 2 ** 7 - 1 }))", false},
	reflect.Int16: {"MobyNumber.NumberFromWireString.check(Schema.isInt(), Schema.isBetween({ minimum: -(2 ** 15), maximum: 2 ** 15 - 1 }))", false},
	reflect.Int32: {"MobyNumber.NumberFromWireString.check(Schema.isInt(), Schema.isBetween({ minimum: -(2 ** 31), maximum: 2 ** 31 - 1 }))", false},
	reflect.Int64: {"MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))", false},

	reflect.Uint:   {"MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))", false},
	reflect.Uint8:  {"MobyNumber.NumberFromWireString.check(Schema.isInt(), Schema.isBetween({ minimum: 0, maximum: 2 ** 8 - 1 }))", false},
	reflect.Uint16: {"MobyNumber.NumberFromWireString.check(Schema.isInt(), Schema.isBetween({ minimum: 0, maximum: 2 ** 16 - 1 }))", false},
	reflect.Uint32: {"MobyNumber.NumberFromWireString.check(Schema.isInt(), Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 }))", false},
	reflect.Uint64: {"MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))", false},
}

func tsTypeToString(t TSType) string {
	if t.Nullable {
		return fmt.Sprintf("Schema.NullOr(%s)", t.StrRepresentation)
	} else {
		return t.StrRepresentation
	}
}

func tsPropertyToString(p TSProperty) string {
	var out string
	if p.IsAnonymous {
		m := TSModelType{GoSourceName: p.FieldName}
		return fmt.Sprintf("...%s.%s.fields", m.Name(), m.Name())
	} else if p.IsOpt && p.Type.Nullable {
		out = fmt.Sprintf("Schema.optional(Schema.NullOr(%s))", p.Type.StrRepresentation)
	} else if p.IsOpt {
		out = fmt.Sprintf("Schema.optional(%s)", p.Type.StrRepresentation)
	} else {
		out = tsTypeToString(p.Type)
	}
	if p.DefaultValue != "" {
		out = fmt.Sprintf("%s.pipe(Schema.withConstructorDefault(Effect.sync(%s)))", out, p.DefaultValue)
	}
	return out
}

func goTypeToTsType(t reflect.Type) TSType {
	if replacement, willReplace := typesToReplace[t]; willReplace {
		if replacement.Nullable ||
			t.Kind() == reflect.Pointer ||
			t.Kind() == reflect.Slice ||
			t.Kind() == reflect.Map ||
			t.Kind() == reflect.Struct {
			return TSType{replacement.StrRepresentation, true}
		}
		return replacement
	}

	if t.Kind().String() == "string" && t.Name() != "string" {
		var literals []string
		results := getEnumLiterals(t)
		if len(results) == 0 {
			println("no literals found for type:", t.String())
			goto noLiteralsForStringType
		}
		for _, r := range results {
			literals = append(literals, fmt.Sprintf(`"%s"`, r.Value))
		}
		if len(literals) == 1 {
			return TSType{fmt.Sprintf("Schema.Literal(%s)", literals[0]), false}
		}
		return TSType{fmt.Sprintf("Schema.Literals([%s])", strings.Join(literals, ", ")), false}
	}

noLiteralsForStringType:
	def, found := TSInboxTypesMap[t.Kind()]
	if found {
		return def
	}

	if t == EmptyStruct {
		return TSType{"Schema.ObjectKeyword", false}
	}

	switch t.Kind() {
	case reflect.Slice:
		inner := tsTypeToString(goTypeToTsType(t.Elem()))
		return TSType{fmt.Sprintf("Schema.Array(%s)", inner), true}
	case reflect.Map:
		innerKey := tsTypeToString(goTypeToTsType(t.Key()))
		innerValue := tsTypeToString(goTypeToTsType(t.Elem()))
		return TSType{fmt.Sprintf("Schema.Record(%s, %s)", innerKey, innerValue), true}
	case reflect.Array:
		len := t.Len()
		inner := tsTypeToString(goTypeToTsType(t.Elem()))
		return TSType{fmt.Sprintf("Schema.Array(%s).check(Schema.isLengthBetween(%d, %d))", inner, len, len), false}
	case reflect.Pointer:
		ptr := goTypeToTsType(t.Elem())
		ptr.Nullable = true
		return ptr
	case reflect.Struct:
		m := TSModelType{GoSourceName: t.String()}
		return TSType{fmt.Sprintf("%s.%s", m.Name(), m.Name()), true}
	case reflect.Interface:
		return TSType{"Schema.ObjectKeyword", false}
	case reflect.Func:
		return TSType{"Schema.Never", false}
	case reflect.Uintptr:
		return TSType{"Schema.Never", false}
	default:
		panic(fmt.Errorf("cannot convert type %s", t))
	}
}

func (t *TSModelType) Name() string {
	if newName, willRename := typesToRename[t.GoSourceName]; willRename {
		return newName
	}
	return strings.Title(strings.ReplaceAll(t.GoSourceName, ".", ""))
}

func (t *TSModelType) Title() string {
	return t.GoSourceName
}

func (t *TSModelType) Documentation() string {
	return generateDocLink(t.GoSourceName)
}

var identifierRegexp = regexp.MustCompile(`^[A-Za-z_$][A-Za-z0-9_$]*$`)

func formatFieldName(name string) string {
	if identifierRegexp.MatchString(name) {
		return name
	}
	return fmt.Sprintf("%q", name)
}

func (t *TSModelType) WriteProperties() string {
	var buffer bytes.Buffer
	for _, p := range t.Properties {
		if p.IsAnonymous {
			buffer.WriteString(fmt.Sprintf("        %s,\n", tsPropertyToString(p)))
		} else {
			buffer.WriteString(fmt.Sprintf("        %s: %s,\n", formatFieldName(p.FieldName), tsPropertyToString(p)))
		}
	}
	return buffer.String()
}

func (t *TSModelType) WriteInlineStruct() string {
	var buffer bytes.Buffer
	buffer.WriteString(fmt.Sprintln("Schema.Struct({"))
	buffer.WriteString(t.WriteProperties())
	buffer.WriteString(fmt.Sprintln("})"))
	return buffer.String()
}

func (t *TSModelType) WriteClass(w io.Writer) {
	var buffer bytes.Buffer
	buffer.WriteString(fmt.Sprintf("export class %s extends Schema.Class<%s>(\"%s\")(\n", t.Name(), t.Name(), t.Name()))
	buffer.WriteString(fmt.Sprintln("    {"))
	buffer.WriteString(t.WriteProperties())
	buffer.WriteString(fmt.Sprintln("    },"))
	buffer.WriteString(fmt.Sprintln("    {"))
	buffer.WriteString(fmt.Sprintf("        identifier: \"%s\",\n", t.Name()))
	buffer.WriteString(fmt.Sprintf("        title: \"%s\",\n", t.Title()))
	buffer.WriteString(fmt.Sprintf("        documentation: \"%s\",\n", t.Documentation()))
	buffer.WriteString(fmt.Sprintln("    }"))
	buffer.WriteString(fmt.Sprintln(") {}"))

	outString := buffer.String()

	knownImports := []struct {
		namespace string
		line      string
	}{
		{"EffectSchemas", "import * as EffectSchemas from \"effect-schemas\";\n"},
		{"Effect", "import * as Effect from \"effect/Effect\";\n"},
		{"Schema", "import * as Schema from \"effect/Schema\";\n"},
		{"MobyIdentifiers", "import * as MobyIdentifiers from \"../schemas/id.ts\";\n"},
		{"MobyNumber", "import * as MobyNumber from \"../schemas/number.ts\";\n"},
		{"PortSchemas", "import * as PortSchemas from \"../schemas/port.ts\";\n"},
	}
	for _, imp := range knownImports {
		if usesNamespace(outString, imp.namespace) {
			fmt.Fprint(w, imp.line)
		}
	}

	importsUnsorted := make(map[string]string)
	for _, p := range t.Properties {
		for _, typeName := range []string{p.Type.StrRepresentation, p.DefaultValue} {
			// A reference to another generated type looks like `Foo.Foo`,
			// which tokenizes to two adjacent identical identifiers.
			parts := strings.FieldsFunc(typeName, func(r rune) bool {
				return !isIdentifierChar(byte(r)) || r > 127
			})

			for i := 0; i+1 < len(parts); i++ {
				if parts[i] == parts[i+1] &&
					identifierRegexp.MatchString(parts[i]) &&
					strings.Contains(typeName, parts[i]+"."+parts[i+1]) {
					importsUnsorted[parts[i]] = fmt.Sprintf("import * as %s from \"./%s.generated.ts\";\n", parts[i], parts[i])
				}
			}
		}
	}

	importNames := make([]string, 0, len(importsUnsorted))
	for name := range importsUnsorted {
		importNames = append(importNames, name)
	}
	sort.Strings(importNames)
	for _, name := range importNames {
		fmt.Fprint(w, importsUnsorted[name])
	}

	fmt.Fprintf(w, "\n")
	fmt.Fprint(w, outString)
}

func isIdentifierChar(c byte) bool {
	return c == '_' || c == '$' ||
		(c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9')
}

// usesNamespace reports whether src references the given namespace (i.e.
// contains `namespace.` not preceded by another identifier character).
func usesNamespace(src string, namespace string) bool {
	needle := namespace + "."
	offset := 0
	for {
		idx := strings.Index(src[offset:], needle)
		if idx == -1 {
			return false
		}
		abs := offset + idx
		if abs == 0 || !isIdentifierChar(src[abs-1]) {
			return true
		}
		offset = abs + 1
	}
}
