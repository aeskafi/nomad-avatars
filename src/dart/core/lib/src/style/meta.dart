/// Read-only view over a style definition's `meta` block.
library;

import 'meta_creator.dart';
import 'meta_license.dart';
import 'meta_source.dart';

/// The metadata of a style, exposing the license, creator, and source
/// descriptors. Each descriptor defaults to an empty block when the style
/// definition omits the field, so callers never need a null check.
class Meta {
  final Map<String, Object?> _data;
  MetaLicense? _license;
  MetaCreator? _creator;
  MetaSource? _source;

  Meta(Map<String, Object?> data) : _data = data;

  /// Returns the license descriptor, lazily constructed on first access and
  /// defaulting to an empty block when the style definition omits the field.
  MetaLicense license() => _license ??=
      MetaLicense(_data['license'] as Map<String, Object?>? ?? const {});

  /// Returns the creator descriptor, lazily constructed on first access and
  /// defaulting to an empty block when the style definition omits the field.
  MetaCreator creator() => _creator ??=
      MetaCreator(_data['creator'] as Map<String, Object?>? ?? const {});

  /// Returns the source descriptor, lazily constructed on first access and
  /// defaulting to an empty block when the style definition omits the field.
  MetaSource source() => _source ??=
      MetaSource(_data['source'] as Map<String, Object?>? ?? const {});
}
