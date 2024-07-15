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
	reflect.Float32: {"Schema.Number", true},
	reflect.Float64: {"Schema.Number", true},
	reflect.String:  {"Schema.String", false},
	reflect.Bool:    {"Schema.Boolean", true},

	// In practice most clients are 64bit so in go Int will be too
	reflect.Int:   {"MobySchemas.Int64", true},
	reflect.Int8:  {"MobySchemas.Int8", true},
	reflect.Int16: {"MobySchemas.Int16", true},
	reflect.Int32: {"MobySchemas.Int32", true},
	reflect.Int64: {"MobySchemas.Int64", true},

	// In practice most clients are 64bit so in go Uint will be too.
	reflect.Uint:   {"MobySchemas.UInt64", true},
	reflect.Uint8:  {"MobySchemas.UInt8", true},
	reflect.Uint16: {"MobySchemas.UInt16", true},
	reflect.Uint32: {"MobySchemas.UInt32", true},
	reflect.Uint64: {"MobySchemas.UInt64", true},
}

func NewModel(name, sourceName string) *TSModelType {
	s := TSModelType{
		Name:       name,
		SourceName: sourceName,
	}
	return &s
}

func tsType(t reflect.Type) TSType {
	def, found := TSInboxTypesMap[t.Kind()]
	if found {
		return def
	}

	switch t.Kind() {
	case reflect.Array:
		return TSType{fmt.Sprintf("Schema.Array(%s)", tsType(t.Elem()).Name), false}
	case reflect.Slice:
		return TSType{fmt.Sprintf("Schema.Array(%s)", tsType(t.Elem()).Name), true}
	case reflect.Map:
		return TSType{fmt.Sprintf("Schema.Record(%s, %s)", tsType(t.Key()).Name, tsType(t.Elem()).Name), true}
	case reflect.Ptr:
		ptr := tsType(t.Elem())
		ptr.Nullable = true
		return ptr
	case reflect.Struct:
		return TSType{fmt.Sprintf("MobySchemasGenerated.%s", t.Name()), false}
	case reflect.Interface:
		return TSType{"Schema.Object", false}
	default:
		panic(fmt.Errorf("cannot convert type %s", t))
	}
}

func (t *TSModelType) Write(w io.Writer) {
	var buffer bytes.Buffer
	buffer.WriteString(fmt.Sprintf("export class %s extends Schema.Class<%s>(\"%s\")(\n", t.Name, t.Name, t.Name))
	buffer.WriteString(fmt.Sprintln("    {"))
	for _, p := range t.Properties {
		if p.IsOpt && p.Type.Nullable {
			buffer.WriteString(fmt.Sprintf("        \"%s\": Schema.optional(%s, { nullable: %t }),\n", p.Name, p.Type.Name, p.Type.Nullable))
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
	fmt.Fprintf(w, "import * as Schema from \"@effect/schema/Schema\";\n")
	if strings.Contains(outString, "MobySchemas.") {
		fmt.Fprintf(w, "import * as MobySchemas from \"../schemas/index.js\";\n")
	}
	if strings.Contains(outString, "MobySchemasGenerated.") {
		fmt.Fprintf(w, "import * as MobySchemasGenerated from \"./index.js\";\n")
	}
	fmt.Fprintf(w, "\n")
	fmt.Fprint(w, outString)
}
