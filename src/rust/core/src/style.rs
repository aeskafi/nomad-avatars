//! Validated, decomposed wrapper around a style definition.
//!
//! The per-concept views (canvas, element, component, color, meta) live in the
//! `style/` submodules, mirroring the original's `Style/` directory.

mod canvas;
mod color;
mod component;
mod component_translate;
mod component_variant;
mod element;
mod meta;
mod meta_creator;
mod meta_license;
mod meta_source;

pub(crate) use canvas::Canvas;
pub(crate) use color::Color;
pub(crate) use component::Component;
pub(crate) use element::{DynValue, Element};
pub(crate) use meta::Meta;

use indexmap::IndexMap;
use serde::Deserialize;
use serde_json::Value;

use crate::error::Error;
use crate::validate;
use component::RawComponent;

/// The raw, deserialized style definition.
#[derive(Deserialize)]
struct Definition {
    #[serde(rename = "$id")]
    id: Option<String>,
    #[serde(rename = "$schema")]
    schema: Option<String>,
    #[serde(rename = "$comment")]
    comment: Option<String>,
    meta: Option<Meta>,
    attributes: Option<IndexMap<String, DynValue>>,
    canvas: Canvas,
    components: Option<IndexMap<String, RawComponent>>,
    colors: Option<IndexMap<String, Color>>,
}

/// A parsed, validated style definition with its component aliases flattened.
pub struct Style {
    id: Option<String>,
    schema: Option<String>,
    comment: Option<String>,
    meta: Option<Meta>,
    attributes: Option<IndexMap<String, DynValue>>,
    canvas: Canvas,
    components: IndexMap<String, Component>,
    colors: IndexMap<String, Color>,
}

impl Style {
    /// Parses and validates a style definition from a JSON string.
    #[allow(clippy::should_implement_trait)]
    pub fn from_str(json: &str) -> Result<Self, Error> {
        Self::from_value(serde_json::from_str(json)?)
    }

    /// Validates and builds a style from an already-parsed JSON value.
    pub fn from_value(value: Value) -> Result<Self, Error> {
        validate::definition(&value)?;

        let def: Definition = serde_json::from_value(value)?;
        validate_aliases(def.components.as_ref())?;

        Ok(Self {
            id: def.id,
            schema: def.schema,
            comment: def.comment,
            meta: def.meta,
            attributes: def.attributes,
            canvas: def.canvas,
            components: component::build(def.components),
            colors: def.colors.unwrap_or_default(),
        })
    }

    /// Returns the definition's `$id`, or `None` when not set.
    pub fn id(&self) -> Option<&str> {
        self.id.as_deref()
    }

    /// Returns the definition's `$schema` URI, or `None` when not set.
    pub fn schema(&self) -> Option<&str> {
        self.schema.as_deref()
    }

    /// Returns the definition's `$comment`, or `None` when not set.
    pub fn comment(&self) -> Option<&str> {
        self.comment.as_deref()
    }

    pub(crate) fn canvas(&self) -> &Canvas {
        &self.canvas
    }

    pub(crate) fn root_attributes(&self) -> Option<&IndexMap<String, DynValue>> {
        self.attributes.as_ref()
    }

    pub(crate) fn meta(&self) -> Option<&Meta> {
        self.meta.as_ref()
    }

    pub(crate) fn components(&self) -> &IndexMap<String, Component> {
        &self.components
    }

    pub(crate) fn colors(&self) -> &IndexMap<String, Color> {
        &self.colors
    }
}

/// Verifies that every `extends` references an existing, non-alias component —
/// a cross-key constraint the JSON Schema cannot express.
fn validate_aliases(components: Option<&IndexMap<String, RawComponent>>) -> Result<(), Error> {
    let Some(components) = components else {
        return Ok(());
    };

    let mut errors: Vec<String> = Vec::new();

    for (name, entry) in components {
        let RawComponent::Alias { extends } = entry else {
            continue;
        };

        match components.get(extends) {
            None => errors.push(format!(
                "/components/{name}/extends references unknown component \"{extends}\""
            )),
            Some(RawComponent::Alias { .. }) => errors.push(format!(
                "/components/{name}/extends references alias \"{extends}\" — alias chains are not allowed"
            )),
            Some(RawComponent::Base(_)) => {}
        }
    }

    if errors.is_empty() {
        Ok(())
    } else {
        Err(Error::Validation(errors.join("; ")))
    }
}
