package main

import (
	"errors"
	"strings"
)

type JsonTag struct {
	Name      string
	OmitEmpty bool
}

// This can take the form of json:"..."
func JsonTagFromString(tag string) (JsonTag, error) {
	if tag == "" {
		return JsonTag{}, errors.New("nil or empty json tag string")
	}

	entries := strings.Split(tag, ",")
	ret := JsonTag{Name: "", OmitEmpty: false}

	for _, entry := range entries {
		if strings.Compare(entry, "omitempty") == 0 {
			ret.OmitEmpty = true
		} else {
			ret.Name = strings.Trim(entry, "\"")
		}
	}

	return ret, nil
}
