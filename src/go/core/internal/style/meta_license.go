package style

// MetaLicense is a view over the meta.license block of a style definition.
//
// The fields are *string so the license builder can distinguish an absent field
// from one explicitly set to the empty string, matching the JS nullish
// (`?? 'Unknown'`) and Rust Option logic.
type MetaLicense struct {
	Name *string `json:"name"`
	URL  *string `json:"url"`
	Text *string `json:"text"`
}
