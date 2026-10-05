package style

// MetaSource is a view over the meta.source block of a style definition.
type MetaSource struct {
	Name *string `json:"name"`
	URL  *string `json:"url"`
}
