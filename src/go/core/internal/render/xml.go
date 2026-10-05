package render

import "strings"

// escapeXML returns value with the five XML predefined entities escaped. The
// substitution is done per rune so there is no double-escaping of '&'.
func escapeXML(value string) string {
	var b strings.Builder
	b.Grow(len(value))

	for _, ch := range value {
		switch ch {
		case '&':
			b.WriteString("&amp;")
		case '\'':
			b.WriteString("&apos;")
		case '"':
			b.WriteString("&quot;")
		case '<':
			b.WriteString("&lt;")
		case '>':
			b.WriteString("&gt;")
		default:
			b.WriteRune(ch)
		}
	}

	return b.String()
}
