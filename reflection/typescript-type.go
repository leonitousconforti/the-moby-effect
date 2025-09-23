package main

import (
	"bytes"
	"fmt"
	"io"
	"maps"
	"reflect"
	"slices"
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
	reflect.Float32: {"Schema.Number", false},
	reflect.Float64: {"Schema.Number", false},
	reflect.String:  {"Schema.String", false},
	reflect.Bool:    {"Schema.Boolean", false},

	// In practice most clients are 64bit so in go Int will be too
	reflect.Int:   {"MobySchemas.Int64", false},
	reflect.Int8:  {"MobySchemas.Int8", false},
	reflect.Int16: {"MobySchemas.Int16", false},
	reflect.Int32: {"MobySchemas.Int32", false},
	reflect.Int64: {"MobySchemas.Int64", false},

	// In practice most clients are 64bit so in go Uint will be too.
	reflect.Uint:   {"MobySchemas.UInt64", false},
	reflect.Uint8:  {"MobySchemas.UInt8", false},
	reflect.Uint16: {"MobySchemas.UInt16", false},
	reflect.Uint32: {"MobySchemas.UInt32", false},
	reflect.Uint64: {"MobySchemas.UInt64", false},
}

func tsTypeToString(t TSType) string {
	if t.Nullable {
		return fmt.Sprintf("Schema.NullOr(%s)", t.StrRepresentation)
	} else {
		return t.StrRepresentation
	}
}

func tsPropertyToString(p TSProperty) string {
	if p.IsAnonymous {
		m := TSModelType{GoSourceName: p.FieldName}
		return fmt.Sprintf("...%s.%s.fields", m.Name(), m.Name())
	} else if p.IsOpt && p.Type.Nullable {
		return fmt.Sprintf("Schema.optionalWith(%s, { nullable: true })", p.Type.StrRepresentation)
	} else if p.IsOpt {
		return fmt.Sprintf("Schema.optional(%s)", p.Type.StrRepresentation)
	} else {
		return tsTypeToString(p.Type)
	}
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
		return TSType{fmt.Sprintf("Schema.Literal(%s)", strings.Join(literals, ", ")), false}
	}

noLiteralsForStringType:
	def, found := TSInboxTypesMap[t.Kind()]
	if found {
		return def
	}

	if t == EmptyStruct {
		return TSType{"Schema.Object", false}
	}

	switch t.Kind() {
	case reflect.Slice:
		inner := tsTypeToString(goTypeToTsType(t.Elem()))
		return TSType{fmt.Sprintf("Schema.Array(%s)", inner), true}
	case reflect.Map:
		innerKey := tsTypeToString(goTypeToTsType(t.Key()))
		innerValue := tsTypeToString(goTypeToTsType(t.Elem()))
		return TSType{fmt.Sprintf("Schema.Record({ key: %s, value: %s })", innerKey, innerValue), true}
	case reflect.Array:
		len := t.Len()
		inner := tsTypeToString(goTypeToTsType(t.Elem()))
		return TSType{fmt.Sprintf("Schema.Array(%s).pipe(Schema.itemsCount(%d))", inner, len), false}
	case reflect.Pointer:
		ptr := goTypeToTsType(t.Elem())
		ptr.Nullable = true
		return ptr
	case reflect.Struct:
		m := TSModelType{GoSourceName: t.String()}
		return TSType{fmt.Sprintf("%s.%s", m.Name(), m.Name()), true}
	case reflect.Interface:
		return TSType{"Schema.Object", false}
	case reflect.Func:
		return TSType{"Schema.Never", false}
	case reflect.Uintptr:
		return TSType{"Schema.Never", false}
	default:
		panic(fmt.Errorf("cannot convert type %s", t))
	}
}

func (t *TSModelType) Name() string {
	return strings.Title(strings.ReplaceAll(t.GoSourceName, ".", ""))
}

func (t *TSModelType) Title() string {
	return t.GoSourceName
}

func (t *TSModelType) Documentation() string {
	return generateDocLink(t.GoSourceName)
}

func (t *TSModelType) WriteProperties() string {
	var buffer bytes.Buffer
	for _, p := range t.Properties {
		if p.IsAnonymous {
			buffer.WriteString(fmt.Sprintf("    %s,\n", tsPropertyToString(p)))
		} else {
			buffer.WriteString(fmt.Sprintf("    \"%s\": %s,\n", p.FieldName, tsPropertyToString(p)))
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
	fmt.Fprintf(w, "import * as Schema from \"effect/Schema\";\n")
	if strings.Contains(outString, "MobySchemas.") {
		fmt.Fprintf(w, "import * as MobySchemas from \"../schemas/index.js\";\n")
	}

	importsUnsorted := make(map[string]string)
	for _, p := range t.Properties {
		typeName := p.Type.StrRepresentation
		parts := strings.FieldsFunc(typeName, func(r rune) bool {
			return r == '.' || r == '(' || r == ')'
		})

		for i := 0; i+1 < len(parts); i++ {
			if parts[i] == parts[i+1] {
				importsUnsorted[parts[i]] = fmt.Sprintf("import * as %s from \"./%s.generated.js\";\n", parts[i], parts[i])
			}
		}
	}

	for _, k := range slices.Sorted(maps.Keys(importsUnsorted)) {
		fmt.Fprint(w, importsUnsorted[k])
	}

	fmt.Fprintf(w, "\n")
	fmt.Fprint(w, outString)
}
