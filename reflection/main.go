package main

import (
	"bufio"
	"fmt"
	"os"
	"path"
	"reflect"
	"strings"
)

var reflectedTypes = map[string]*TSModelType{}

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

func reflectTypeMembers(typeToReflect reflect.Type, m *TSModelType) {
	for index := 0; index < typeToReflect.NumField(); index++ {
		field := typeToReflect.Field(index)
		jsonTag, _ := JsonTagFromString(field.Tag.Get("json"))

		// If the json tag says to omit we skip any generation
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
			m2 := NewModel(name, field.Name)
			reflectTypeMembers(field.Type, m2)
			tsProp := TSProperty{Name: name, Type: TSType{Name: m2.WriteInlineStruct(), Nullable: false}, IsOpt: jsonTag.OmitEmpty}
			m.Properties = append(m.Properties, tsProp)
			continue
		}

		// Embedded struct definitions
		if field.Anonymous {
			ut := ultimateType(field.Type)
			reflectType(ut)
			newType := reflectedTypes[typeToKey(ut)]
			tsTypeName := fmt.Sprintf("%s.%s", newType.Name, newType.Name)
			tsType := TSType{Name: tsTypeName, Nullable: false}
			tsProp := TSProperty{Name: newType.Name, Type: tsType, IsOpt: false, IsAnonymous: true}
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
		tsProp := TSProperty{Name: name, Type: tsType(field.Type), IsOpt: jsonTag.OmitEmpty}
		m.Properties = append(m.Properties, tsProp)
	}
}

func reflectType(t reflect.Type) {
	k := typeToKey(t)
	if _, alreadyInserted := reflectedTypes[k]; alreadyInserted {
		return
	}

	if _, shouldSkip := typesToSkip[k]; shouldSkip {
		return
	}

	if t.Name() == "" {
		panic("Unable to reflect a type with no name")
	}

	var name string
	n, ok := typesToDisambiguate[k]
	if ok {
		name = n
	} else {
		name = t.Name()
	}

	activeType := NewModel(name, t.String())
	reflectedTypes[k] = activeType
	reflectTypeMembers(t, activeType)
}

func main() {
	cwd, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	sourcePath := path.Join(cwd, "internal", "generated")
	err = os.RemoveAll(sourcePath)
	if err != nil {
		panic(err)
	}

	err = os.MkdirAll(sourcePath, 0755)
	if err != nil {
		panic(err)
	}

	for _, t := range dockerTypesToReflect {
		reflectType(t)
	}

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
		err = os.Rename(f.Name(), path.Join(sourcePath, v.Name+".generated.ts"))
		if err != nil {
			panic(err)
		}
	}

	f, err := os.CreateTemp(sourcePath, "")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	b := bufio.NewWriter(f)
	for _, z := range reflectedTypes {
		fmt.Fprintln(b, "export * from \"./"+z.Name+".generated.js\";")
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
