"""Validated style wrapper and its read-only sub-views.

:class:`Style` is the validated, lazily-decomposed wrapper around a style
definition; the sub-views (:class:`Canvas`, :class:`Component`, :class:`Meta`,
…) mirror the ``Style/*`` types of the PHP/JS ports.
"""

from __future__ import annotations

from ._style import Style
from .canvas import Canvas
from .color import Color
from .component import Component
from .component_translate import ComponentTranslate
from .component_variant import ComponentVariant
from .element import Element
from .meta import Meta
from .meta_creator import MetaCreator
from .meta_license import MetaLicense
from .meta_source import MetaSource

__all__ = [
    "Canvas",
    "Color",
    "Component",
    "ComponentTranslate",
    "ComponentVariant",
    "Element",
    "Meta",
    "MetaCreator",
    "MetaLicense",
    "MetaSource",
    "Style",
]
