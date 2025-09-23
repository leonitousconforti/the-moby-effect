package main

import (
	"errors"
	"strings"
)

type RestTag struct {
	In       string
	Name     string
	Required bool
	Default  string
}

const (
	HEADER = "header"
	BODY   = "body"
	QUERY  = "query"
)

// This can take the form of rest:in,name,required
func RestTagFromString(tag string) (RestTag, error) {
	if tag == "" {
		return RestTag{}, errors.New("nil or empty rest tag string")
	}

	entries := strings.Split(tag, ",")
	len := len(entries)

	ret := RestTag{In: "", Name: "", Required: false}
	if len >= 1 {
		ret.In = entries[0]
		switch ret.In {
		case HEADER:
		case BODY:
		case QUERY:
		default:
			return RestTag{}, errors.New("Incorrect 'in' value: " + ret.In)
		}
	}

	if len >= 2 {
		ret.Name = entries[1]
	}

	if len >= 3 && entries[2] == "required" {
		ret.Required = true
	}

	if len >= 4 {
		ret.Default = entries[3]
	}

	return ret, nil
}
