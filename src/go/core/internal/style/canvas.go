package style

// Canvas is a read-only view over a style definition's canvas block: the
// drawing-area dimensions and the top-level element list.
type Canvas struct {
	Width    float64   `json:"width"`
	Height   float64   `json:"height"`
	Elements []Element `json:"elements"`
}
