package main

import (
	"go/ast"
	"go/build"
	"go/parser"
	"go/token"
	"reflect"
	"strings"
)

type ConstantInfo struct {
	Name  string
	Value string
}

type Visitor struct {
	fset           *token.FileSet
	targetType     string
	foundConstants *[]ConstantInfo
}

// Visit is called for each node in the AST.
func (v *Visitor) Visit(node ast.Node) ast.Visitor {
	if node == nil {
		return nil
	}

	// We are interested in general declarations, specifically 'const' blocks.
	genDecl, ok := node.(*ast.GenDecl)

	// Not a const declaration, continue walking
	if !ok || genDecl.Tok != token.CONST {
		return v
	}

	// Now iterate through the individual specifications within the const block.
	for _, spec := range genDecl.Specs {
		valueSpec, ok := spec.(*ast.ValueSpec)
		if !ok {
			continue
		}

		// We need to check the type associated with the constant.
		if valueSpec.Type != nil {
			ident, isIdent := valueSpec.Type.(*ast.Ident)
			if isIdent && ident.Name == v.targetType {
				for i, name := range valueSpec.Names {
					if len(valueSpec.Values) > i {
						if lit, isLit := valueSpec.Values[i].(*ast.BasicLit); isLit && lit.Kind == token.STRING {
							strValue := strings.Trim(lit.Value, `"`)
							*v.foundConstants = append(*v.foundConstants, ConstantInfo{
								Name:  name.Name,
								Value: strValue,
							})
						}
					}
				}
			}
		}

		// A more complex scenario would handle `iota` and untyped constants
		// where the type is inferred from the first constant in the block.
		// For the `container.ContainerStatus` constants, they are explicitly typed.
	}

	return v
}

func getEnumLiterals(t reflect.Type) []ConstantInfo {
	pkg, err := build.Import(t.PkgPath(), "", build.FindOnly)
	if err != nil {
		panic(err)
	}

	fset := token.NewFileSet()
	packages, err := parser.ParseDir(fset, pkg.Dir, nil, 0)
	if err != nil {
		panic(err)
	}

	var allConstants []ConstantInfo
	pkgName := strings.Split(t.PkgPath(), "/")[len(strings.Split(t.PkgPath(), "/"))-1]
	for _, p := range packages {
		if p.Name == pkgName {
			visitor := &Visitor{
				fset:           fset,
				targetType:     t.Name(),
				foundConstants: &allConstants,
			}
			ast.Walk(visitor, p)
			break
		}
	}

	// for _, c := range allConstants {
	// 	println(c.Name, "=", c.Value)
	// }

	return allConstants
}
