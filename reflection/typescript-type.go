package main

import (
	"bytes"
	"fmt"
	"io"
	"reflect"
	"strings"
)

type TSType struct {
	Name     string
	Nullable bool
}

type TSProperty struct {
	Name         string
	Type         TSType
	IsOpt        bool
	DefaultValue string
}

type TSModelType struct {
	IsStarted  bool
	Name       string
	SourceName string
	Properties []TSProperty
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

func NewModel(name, sourceName string) *TSModelType {
	s := TSModelType{
		Name:       name,
		SourceName: sourceName,
	}
	return &s
}

func tsTypeToString(t TSType) string {
	if t.Nullable {
		return fmt.Sprintf("Schema.NullOr(%s)", t.Name)
	} else {
		return t.Name
	}
}

func tsType(t reflect.Type) TSType {
	def, found := TSInboxTypesMap[t.Kind()]
	if found {
		return def
	}

	if t == EmptyStruct {
		return TSType{"Schema.Object", false}
	}

	switch t.Kind() {
	case reflect.Slice:
		return TSType{fmt.Sprintf("Schema.Array(%s)", tsTypeToString(tsType(t.Elem()))), true}
	case reflect.Map:
		return TSType{fmt.Sprintf("Schema.Record({ key: %s, value: %s })", tsTypeToString(tsType(t.Key())), tsTypeToString(tsType(t.Elem()))), true}
	case reflect.Array:
		return TSType{fmt.Sprintf("Schema.Array(%s).pipe(Schema.itemsCount(%d))", tsTypeToString(tsType(t.Elem())), t.Len()), false}
	case reflect.Pointer:
		ptr := tsType(t.Elem())
		ptr.Nullable = true
		return ptr
	case reflect.Struct:
		var name string
		k := typeToKey(t)
		n, ok := typesToDisambiguate[k]
		if ok {
			name = n
		} else {
			name = t.Name()
		}
		return TSType{fmt.Sprintf("%s.%s", name, name), true}
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

func (t *TSModelType) WriteInlineStruct() string {
	var buffer bytes.Buffer
	buffer.WriteString(fmt.Sprintln("Schema.Struct({"))
	for _, p := range t.Properties {
		if p.IsOpt && p.Type.Nullable {
			buffer.WriteString(fmt.Sprintf("    \"%s\": Schema.optionalWith(%s, { nullable: %t }),\n", p.Name, p.Type.Name, p.Type.Nullable))
		} else if p.IsOpt {
			buffer.WriteString(fmt.Sprintf("    \"%s\": Schema.optional(%s),\n", p.Name, p.Type.Name))
		} else if p.Type.Nullable {
			buffer.WriteString(fmt.Sprintf("    \"%s\": Schema.NullOr(%s),\n", p.Name, p.Type.Name))
		} else {
			buffer.WriteString(fmt.Sprintf("    \"%s\": %s,\n", p.Name, p.Type.Name))
		}
	}
	buffer.WriteString(fmt.Sprintln("})"))
	return buffer.String()
}

func (t *TSModelType) WriteClass(w io.Writer) {
	var buffer bytes.Buffer
	buffer.WriteString(fmt.Sprintf("export class %s extends Schema.Class<%s>(\"%s\")(\n", t.Name, t.Name, t.Name))
	buffer.WriteString(fmt.Sprintln("    {"))
	for _, p := range t.Properties {
		if p.IsOpt && p.Type.Nullable {
			buffer.WriteString(fmt.Sprintf("        \"%s\": Schema.optionalWith(%s, { nullable: %t }),\n", p.Name, p.Type.Name, p.Type.Nullable))
		} else if p.IsOpt {
			buffer.WriteString(fmt.Sprintf("        \"%s\": Schema.optional(%s),\n", p.Name, p.Type.Name))
		} else if p.Type.Nullable {
			buffer.WriteString(fmt.Sprintf("        \"%s\": Schema.NullOr(%s),\n", p.Name, p.Type.Name))
		} else {
			buffer.WriteString(fmt.Sprintf("        \"%s\": %s,\n", p.Name, p.Type.Name))
		}
	}
	buffer.WriteString(fmt.Sprintln("    },"))
	buffer.WriteString(fmt.Sprintln("    {"))
	buffer.WriteString(fmt.Sprintf("        identifier: \"%s\",\n", t.Name))
	buffer.WriteString(fmt.Sprintf("        title: \"%s\",\n", t.SourceName))
	buffer.WriteString(fmt.Sprintln("    }"))
	buffer.WriteString(fmt.Sprintln(") {}"))

	outString := buffer.String()
	fmt.Fprintf(w, "import * as Schema from \"effect/Schema\";\n")
	if strings.Contains(outString, "MobySchemas.") {
		fmt.Fprintf(w, "import * as MobySchemas from \"../schemas/index.js\";\n")
	}

	imports := make(map[string]bool)
	for _, p := range t.Properties {
		typeName := p.Type.Name
		parts := strings.FieldsFunc(typeName, func(r rune) bool {
			return r == '.' || r == '(' || r == ')'
		})

		for i := range len(parts) - 1 {
			if parts[i] == parts[i+1] {
				packageName := parts[i]
				if _, ok := imports[packageName]; !ok {
					fmt.Fprintf(w, "import * as %s from \"./%s.generated.js\";\n", packageName, packageName)
					imports[packageName] = true
					break
				}
			}
		}
	}

	fmt.Fprintf(w, "\n")
	fmt.Fprint(w, outString)
}
