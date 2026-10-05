/// Read-only view over a style definition's `canvas` block.
library;

import 'element.dart';

/// The drawing area of a style: the `viewBox` dimensions and the top-level
/// element list.
class Canvas {
  final Map<String, Object?> _data;
  List<ElementNode>? _elements;

  Canvas(Map<String, Object?> data) : _data = data;

  /// Returns the canvas width — the `width` value of the SVG `viewBox`.
  double get width => (_data['width'] as num).toDouble();

  /// Returns the canvas height — the `height` value of the SVG `viewBox`.
  double get height => (_data['height'] as num).toDouble();

  /// Returns the top-level elements rendered onto the canvas, lazily wrapped
  /// as [ElementNode] instances on first access.
  List<ElementNode> get elements => _elements ??= List.unmodifiable(
        (_data['elements'] as List<Object?>)
            .map((element) => ElementNode(element as Map<String, Object?>)),
      );
}
