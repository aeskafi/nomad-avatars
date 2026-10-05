package style

// Meta is a view over a style definition's meta block, exposing the license,
// creator, and source descriptors.
type Meta struct {
	License MetaLicense `json:"license"`
	Creator MetaCreator `json:"creator"`
	Source  MetaSource  `json:"source"`
}
