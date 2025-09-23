package main

import (
	"bufio"
	"fmt"
	"os"
	"path"
	"reflect"
	"strings"
)

var reflectedTypes = map[reflect.Type]*TSModelType{}

func ultimateType(t reflect.Type) reflect.Type {
	for {
		switch t.Kind() {
		case reflect.Array, reflect.Chan, reflect.Map, reflect.Ptr, reflect.Slice:
			t = t.Elem()
		default:
			return t
		}
	}
}

func reflectTypeMembers(t reflect.Type, m *TSModelType) {
	for index := 0; index < t.NumField(); index++ {
		field := t.Field(index)

		jsonTag, _ := JsonTagFromString(field.Tag.Get("json"))
		if jsonTag.Skip {
			continue
		}

		var name string
		if strings.Compare(jsonTag.Name, "") == 0 {
			name = field.Name
		} else {
			name = jsonTag.Name
		}

		// Inline struct definitions
		if field.Type.Kind() == reflect.Struct && field.Type.Name() == "" {
			goSourceName := strings.Split(m.GoSourceName, ".")[0] + field.Name
			m2 := &TSModelType{GoSourceName: goSourceName}
			reflectTypeMembers(field.Type, m2)
			tsType := TSType{StrRepresentation: m2.WriteInlineStruct(), Nullable: false}
			tsProp := TSProperty{FieldName: name, Type: tsType, IsOpt: jsonTag.OmitEmpty}
			m.Properties = append(m.Properties, tsProp)
			continue
		}

		// Embedded struct definitions
		if field.Anonymous {
			ut := ultimateType(field.Type)
			reflectType(ut)
			newType := reflectedTypes[ut]
			tsTypeName := fmt.Sprintf("%s.%s", newType.Name(), newType.Name())
			tsType := TSType{StrRepresentation: tsTypeName, Nullable: false}
			tsProp := TSProperty{FieldName: newType.GoSourceName, Type: tsType, IsOpt: false, IsAnonymous: true}
			m.Properties = append(m.Properties, tsProp)
			continue
		}

		// If we are referencing a struct that isn't inline or anonymous we need to update it too
		ut := ultimateType(field.Type)
		if ut.Kind() == reflect.Struct && ut != EmptyStruct {
			if _, ok := TSInboxTypesMap[field.Type.Kind()]; !ok {
				reflectType(ut)
			}
		}
		tsProp := TSProperty{FieldName: name, Type: goTypeToTsType(field.Type), IsOpt: jsonTag.OmitEmpty}
		m.Properties = append(m.Properties, tsProp)
	}
}

func reflectType(t reflect.Type) {
	if _, willReplace := typesToReplace[t]; willReplace {
		return
	}

	if _, alreadyInserted := reflectedTypes[t]; alreadyInserted {
		return
	}

	// Needs to be a struct or something with a name
	if t.Name() == "" {
		panic("Unable to reflect a type with no name")
	}

	activeType := &TSModelType{GoSourceName: t.String()}
	reflectedTypes[t] = activeType
	reflectTypeMembers(t, activeType)
}

func main() {
	cwd, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	// Delete old generated files
	sourcePath := path.Join(cwd, "..", "src", "internal", "generated")
	err = os.RemoveAll(sourcePath)
	if err != nil {
		panic(err)
	}

	// Make sure the directory exists
	err = os.MkdirAll(sourcePath, 0755)
	if err != nil {
		panic(err)
	}

	// Reflect all types
	for _, t := range dockerTypesToReflect {
		reflectType(t)
	}

	// Write all reflected types to files
	for _, v := range reflectedTypes {
		f, err := os.CreateTemp(sourcePath, "")
		if err != nil {
			panic(err)
		}
		defer f.Close()

		b := bufio.NewWriter(f)
		v.WriteClass(b)
		err = b.Flush()
		if err != nil {
			os.Remove(f.Name())
			panic(err)
		}

		f.Close()
		err = os.Rename(f.Name(), path.Join(sourcePath, v.Name()+".generated.ts"))
		if err != nil {
			panic(err)
		}
	}

	// Write index.ts file
	f, err := os.CreateTemp(sourcePath, "")
	if err != nil {
		panic(err)
	}
	defer f.Close()
	b := bufio.NewWriter(f)
	for _, z := range reflectedTypes {
		fmt.Fprintln(b, "export * from \"./"+z.Name()+".generated.js\";")
	}
	err = b.Flush()
	if err != nil {
		os.Remove(f.Name())
		panic(err)
	}
	f.Close()
	err = os.Rename(f.Name(), path.Join(sourcePath, "index.ts"))
	if err != nil {
		panic(err)
	}
}
