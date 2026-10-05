// Package style is the validated, decomposed model of a style definition: the
// element tree, components (with aliases flattened), colors, and metadata, plus
// the OptionsDescriptor that enumerates a style's accepted options.
package style

import (
	"encoding/json"
	"fmt"
	"sort"

	"github.com/dicebear/dicebear-go/v10/internal/errs"
	"github.com/dicebear/dicebear-go/v10/internal/validate"
)

// definition is the raw, deserialized style definition.
type definition struct {
	ID         string                     `json:"$id"`
	Schema     string                     `json:"$schema"`
	Comment    string                     `json:"$comment"`
	Meta       *Meta                      `json:"meta"`
	Attributes AttrList                   `json:"attributes"`
	Canvas     Canvas                     `json:"canvas"`
	Components map[string]json.RawMessage `json:"components"`
	Colors     map[string]ColorDef        `json:"colors"`
}

// Style is a validated, decomposed wrapper around a style definition. New runs
// the JSON Schema validator and the alias cross-reference check, then flattens
// component aliases so the resolver and renderer can treat every entry
// uniformly.
type Style struct {
	id         string
	schema     string
	comment    string
	meta       *Meta
	attributes AttrList
	canvas     Canvas
	components map[string]*Component
	colors     map[string]ColorDef
}

// New parses and validates a style definition from its JSON bytes.
func New(definitionJSON []byte) (*Style, error) {
	if err := validate.Definition(definitionJSON); err != nil {
		return nil, err
	}

	var def definition
	if err := json.Unmarshal(definitionJSON, &def); err != nil {
		return nil, err
	}

	bases, aliases, err := decodeComponents(def.Components)
	if err != nil {
		return nil, err
	}

	if err := validateAliases(bases, aliases); err != nil {
		return nil, err
	}

	return &Style{
		id:         def.ID,
		schema:     def.Schema,
		comment:    def.Comment,
		meta:       def.Meta,
		attributes: def.Attributes,
		canvas:     def.Canvas,
		components: flattenComponents(bases, aliases),
		colors:     def.Colors,
	}, nil
}

// ID returns the definition's $id, or "" when not set.
func (s *Style) ID() string { return s.id }

// Schema returns the definition's $schema URI, or "" when not set.
func (s *Style) Schema() string { return s.schema }

// Comment returns the definition's $comment, or "" when not set.
func (s *Style) Comment() string { return s.comment }

// Canvas returns the canvas view.
func (s *Style) Canvas() *Canvas { return &s.canvas }

// RootAttributes returns the root SVG attributes.
func (s *Style) RootAttributes() *AttrList { return &s.attributes }

// Meta returns the metadata view, or nil when absent.
func (s *Style) Meta() *Meta { return s.meta }

// Components returns the flattened name → component map.
func (s *Style) Components() map[string]*Component { return s.components }

// Colors returns the name → color-definition map.
func (s *Style) Colors() map[string]ColorDef { return s.colors }

// validateAliases verifies that every extends references an existing, non-alias
// component — a cross-key constraint the JSON Schema cannot express.
func validateAliases(bases map[string]*componentData, aliases map[string]string) error {
	names := make([]string, 0, len(aliases))
	for name := range aliases {
		names = append(names, name)
	}
	sort.Strings(names) // deterministic error order

	var details []string
	for _, name := range names {
		target := aliases[name]

		if _, isBase := bases[target]; isBase {
			continue
		}

		if _, isAlias := aliases[target]; isAlias {
			details = append(details, fmt.Sprintf(
				"/components/%s/extends references alias \"%s\" — alias chains are not allowed",
				name, target,
			))
			continue
		}

		details = append(details, fmt.Sprintf(
			"/components/%s/extends references unknown component \"%s\"",
			name, target,
		))
	}

	if len(details) > 0 {
		return &errs.ValidationError{Subject: "style definition", Details: details}
	}
	return nil
}
