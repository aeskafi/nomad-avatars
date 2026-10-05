//! Read-only view over a single render-tree element from a style definition.
//!
//! The same node type covers SVG elements, text, and component references —
//! [`Element::kind`] discriminates between them.

use indexmap::IndexMap;
use serde::Deserialize;

/// An attribute or element value: a literal string, or a typed reference
/// (`{ "type": "color" | "variable", "name": "…" }`).
#[derive(Deserialize, Clone)]
#[serde(untagged)]
pub(crate) enum DynValue {
    Str(String),
    Ref(Ref),
}

/// A `{ "type": …, "name": … }` reference to a named color or built-in variable.
#[derive(Deserialize, Clone)]
pub(crate) struct Ref {
    #[serde(rename = "type")]
    kind: String,
    name: String,
}

impl Ref {
    pub(crate) fn kind(&self) -> &str {
        &self.kind
    }

    pub(crate) fn name(&self) -> &str {
        &self.name
    }
}

#[derive(Deserialize, Clone)]
pub(crate) struct Element {
    #[serde(rename = "type")]
    kind: String,
    name: Option<String>,
    value: Option<DynValue>,
    attributes: Option<IndexMap<String, DynValue>>,
    #[serde(default)]
    children: Vec<Element>,
}

impl Element {
    /// The element type discriminator (`element`, `text`, or `component`).
    /// Named `kind` because `type` is a Rust keyword; mirrors JS `type()`.
    pub(crate) fn kind(&self) -> &str {
        &self.kind
    }

    pub(crate) fn name(&self) -> Option<&str> {
        self.name.as_deref()
    }

    pub(crate) fn value(&self) -> Option<&DynValue> {
        self.value.as_ref()
    }

    pub(crate) fn attributes(&self) -> Option<&IndexMap<String, DynValue>> {
        self.attributes.as_ref()
    }

    pub(crate) fn children(&self) -> &[Element] {
        &self.children
    }
}
