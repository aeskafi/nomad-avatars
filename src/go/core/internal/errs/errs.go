// Package errs holds the error types that surface through the public API. It is
// a leaf package so every other internal package can construct these errors
// without an import cycle; the root package re-exports them via type aliases.
package errs

import (
	"fmt"
	"strings"
)

// ValidationError is returned when a style definition or an options object
// fails schema (or, for style definitions, alias) validation. Details carries
// the individual failures; the Subject distinguishes the two schemas.
type ValidationError struct {
	// Subject is either "style definition" or "options".
	Subject string
	// Details holds one entry per failed constraint.
	Details []string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("invalid %s: %s", e.Subject, strings.Join(e.Details, "; "))
}

// CircularColorReferenceError is returned when a color in the style definition
// references itself, directly or indirectly (e.g. a.contrastTo = b and
// b.contrastTo = a). Chain reproduces the resolution path that closed the cycle.
type CircularColorReferenceError struct {
	Chain []string
}

func (e *CircularColorReferenceError) Error() string {
	return "Circular color reference: " + strings.Join(e.Chain, " → ")
}
