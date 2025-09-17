package main

import (
	"fmt"
	"io"
	"net/http"
	"strings"
)

var pkgDocs, pkgURLs = func() (map[string]string, map[string]string) {
	// Helper to slurp response bodies safely
	fetch := func(url string) string {
		resp, _ := http.Get(url)
		if resp == nil {
			panic("Failed to fetch " + url)
		}
		defer resp.Body.Close()
		b, _ := io.ReadAll(resp.Body)
		return string(b)
	}

	docs := map[string]string{}
	urls := map[string]string{}

	// Base URL for the Docker API types on pkg.go.dev
	const base = "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types"

	docs["types"] = fetch(base)
	urls["types"] = base

	docs["container"] = fetch(base + "/container")
	urls["container"] = base + "/container"

	docs["events"] = fetch(base + "/events")
	urls["events"] = base + "/events"

	docs["image"] = fetch(base + "/image")
	urls["image"] = base + "/image"

	docs["network"] = fetch(base + "/network")
	urls["network"] = base + "/network"

	docs["registry"] = fetch(base + "/registry")
	urls["registry"] = base + "/registry"

	docs["swarm"] = fetch(base + "/swarm")
	urls["swarm"] = base + "/swarm"

	docs["system"] = fetch(base + "/system")
	urls["system"] = base + "/system"

	docs["volume"] = fetch(base + "/volume")
	urls["volume"] = base + "/volume"

	return docs, urls
}()

func generateDocLink(sourceName string) string {
	parts := strings.Split(sourceName, ".")
	packageName := parts[0]
	name := parts[1]

	html, ok := pkgDocs[packageName]
	baseURL, okURL := pkgURLs[packageName]
	if !ok || !okURL || baseURL == "" {
		fmt.Println("Documentation for", sourceName, "not available: unknown package", packageName)
		return ""
	}

	if strings.Contains(html, fmt.Sprintf("id=\"%s\"", name)) ||
		strings.Contains(html, fmt.Sprintf("href=\"#%s\"", name)) {
		url := baseURL + "#" + name
		return url
	}

	panic("Documentation for " + sourceName + " not found: anchor " + name + " missing on " + baseURL)
}
