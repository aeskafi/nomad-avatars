/// Read-only view over an entry in a style definition's `components` block.
library;

import 'dart:collection';

import '../range.dart';
import 'component_translate.dart';
import 'component_variant.dart';

/// An entry in a style definition's `components` block.
///
/// An entry is either a base component with its own dimensions and variants
/// or an alias declared via `extends`. Aliases are pure references — they
/// share the source component's data and inherit dimensions, variants, and
/// all transforms from it, while keeping their own [name]. The
/// split matters for parity: PRNG keys use the alias name, user-option lookup
/// and `<use>` def IDs use [sourceName].
class Component {
  final String _name;
  final String? _extendsName;
  final _ComponentData _data;

  /// Creates a base component from its decoded definition entry.
  Component(String name, Map<String, Object?> data)
      : _name = name,
        _extendsName = null,
        _data = _ComponentData(data);

  /// Creates an alias of [source], sharing the source component's data.
  Component.alias(String name, String extendsName, Component source)
      : _name = name,
        _extendsName = extendsName,
        _data = source._data;

  /// Returns the entry's own name as declared in the style definition. For
  /// aliases this is the alias key, not the source component's name (use
  /// [sourceName] for the canonical user-option key prefix).
  String get name => _name;

  /// Returns the source component name when this entry is an alias, or
  /// `null` for a base component.
  String? get extendsName => _extendsName;

  /// Returns the canonical user-option key prefix: the source component's
  /// name when this entry is an alias, otherwise the entry's own name.
  String get sourceName => _extendsName ?? _name;

  /// Returns the component's intrinsic width in canvas coordinates. For
  /// aliases the source component's width is returned.
  double get width => _data.width;

  /// Returns the component's intrinsic height in canvas coordinates. For
  /// aliases the source component's height is returned.
  double get height => _data.height;

  /// Returns the probability (0–100) that this component is rendered.
  /// Aliases delegate to the source; defaults to 100 (always visible).
  double probability() => _data.probability ?? 100;

  /// Returns the rotation range, or `null` when unset.
  /// Aliases delegate to the source.
  Range? rotate() => _data.rotate;

  /// Returns the scale range, or `null` when unset.
  /// Aliases delegate to the source.
  Range? scale() => _data.scale;

  /// Returns the translate descriptor. Aliases delegate to the source.
  ComponentTranslate translate() => _data.translate;

  /// Returns a name → [ComponentVariant] map for all defined variants, in
  /// definition order. Aliases delegate to the source component's variants.
  Map<String, ComponentVariant> variants() => _data.variants();
}

/// The intrinsic data of a base component, shared by its aliases (the Go
/// port's `componentData`; the Rust port shares it via `Arc`).
class _ComponentData {
  final Map<String, Object?> _raw;
  final double width;
  final double height;
  final double? probability;
  final Range? rotate;
  final Range? scale;
  final ComponentTranslate translate;
  Map<String, ComponentVariant>? _variants;

  _ComponentData(Map<String, Object?> raw)
      : _raw = raw,
        width = (raw['width'] as num).toDouble(),
        height = (raw['height'] as num).toDouble(),
        probability = raw['probability'] == null
            ? null
            : (raw['probability'] as num).toDouble(),
        rotate = rangeFromDefinition(raw['rotate']),
        scale = rangeFromDefinition(raw['scale']),
        translate = ComponentTranslate(
          raw['translate'] as Map<String, Object?>? ?? const {},
        );

  /// Returns the variants map, lazily built on first access. The map keeps
  /// definition order — it drives the weighted pick when the user sets no
  /// `…Variant` option.
  Map<String, ComponentVariant> variants() =>
      _variants ??= UnmodifiableMapView({
        for (final entry
            in (_raw['variants'] as Map<String, Object?>? ?? const {}).entries)
          entry.key: ComponentVariant(entry.value as Map<String, Object?>),
      });
}
