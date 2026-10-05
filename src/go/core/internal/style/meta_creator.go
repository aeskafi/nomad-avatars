package style

// MetaCreator is a view over the meta.creator block of a style definition.
type MetaCreator struct {
	Name *string `json:"name"`
	URL  *string `json:"url"`
}
