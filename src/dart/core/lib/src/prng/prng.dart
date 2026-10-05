/// Key-based pseudorandom number generator and its primitives (FNV-1a,
/// Mulberry32). Each method takes a key that, combined with the seed,
/// produces a deterministic value: the same seed + key always yields the
/// same result, regardless of call order.
library;

import 'dart:math' as math;

import '../range.dart';
import '../utils/number.dart';
import 'fnv1a.dart';
import 'mulberry32.dart';

/// Key-based pseudorandom number generator.
///
/// Each method takes a key that, combined with the seed, produces a
/// deterministic value. The same seed + key always yields the same result,
/// regardless of call order.
class Prng {
  final String _seed;

  Prng(String seed) : _seed = seed;

  /// Returns a single float in `[0, 1)` derived from `seed:key`. The same
  /// seed/key pair always produces the same value.
  double getValue(String key) {
    return Mulberry32(fnv1aHash('$_seed:$key')).nextFloat();
  }

  /// Picks a single item from [items] deterministically. Returns `null` for
  /// an empty list. Duplicate values (by string representation) are collapsed
  /// before picking so that input order and duplication do not affect the
  /// result.
  T? pick<T extends Object>(String key, List<T> items) {
    if (items.isEmpty) {
      return null;
    }

    if (items.length == 1) {
      return items[0];
    }

    final unique = _uniqueByCodePoint(items);

    if (unique.length == 1) {
      return unique[0];
    }

    // After dedupe all sort keys are distinct, so the instability of
    // Dart's `List.sort` cannot be observed.
    unique.sort(_compareByCodePoint);
    final index = (getValue(key) * unique.length).floor();

    return unique[index];
  }

  /// Picks a key from [weights] proportional to its weight. When all weights
  /// are zero, falls back to an unweighted [pick]. Returns `null` for an
  /// empty map.
  String? weightedPick(String key, Map<String, double> weights) {
    if (weights.isEmpty) {
      return null;
    }

    if (weights.length == 1) {
      return weights.keys.first;
    }

    // `String.compareTo` is the UTF-16 code-unit order the JS reference
    // sorts by; the map's insertion order must not leak in.
    final sorted = weights.keys.toList()..sort();

    // Sum in sorted-key order to match the JS reduce-over-sorted parity:
    // float addition is non-associative, so insertion order would diverge.
    var totalWeight = 0.0;

    for (final k in sorted) {
      totalWeight += weights[k]!;
    }

    if (totalWeight == 0) {
      return pick(key, sorted);
    }

    final threshold = getValue(key) * totalWeight;
    var cumulative = 0.0;

    for (final k in sorted) {
      cumulative += weights[k]!;

      if (threshold < cumulative) {
        return k;
      }
    }

    // Safety fallback for float accumulation edges.
    return sorted.last;
  }

  /// Returns `true` with the given probability (0–100, default 50).
  ///
  /// Named `boolean` because `bool` is a reserved type name in Dart; this is
  /// the JS port's `bool`.
  bool boolean(String key, [double likelihood = 50]) {
    return getValue(key) * 100 < likelihood;
  }

  /// Returns a deterministic float in [range], rounded to four decimal
  /// places. With `range.step > 0`, the result is drawn uniformly from
  /// `{ min + i*step | 0 ≤ i ≤ floor((max - min) / step) }`, so both
  /// endpoints of an evenly-divisible range are equally likely. Non-positive
  /// or absent step means continuous. `min`/`max` are sorted internally, so
  /// a reversed pair is tolerated.
  double float(String key, Range range) {
    final min = math.min(range.min, range.max);
    final max = math.max(range.min, range.max);
    final step = range.step ?? 0;
    double value;

    if (step > 0) {
      final buckets = ((max - min) / step).floorToDouble() + 1;
      final i = (getValue(key) * buckets).floorToDouble();
      value = min + i * step;
    } else {
      value = min + getValue(key) * (max - min);
    }

    // JS Math.round rounds half toward +∞; Dart's `round()` would diverge
    // for negative halves. Multiply, round, then divide — per-operation,
    // matching the other ports.
    return roundHalfUp(value * 10000) / 10000;
  }

  /// Returns a deterministic integer in [range]. `min`/`max` are sorted
  /// internally, so a reversed pair is tolerated. `range.step` is accepted
  /// for symmetry with [float] but ignored — integers already step by 1.
  int integer(String key, Range range) {
    final min = math.min(range.min, range.max);
    final max = math.max(range.min, range.max);

    // Compute in doubles like the JS reference and convert at the end; the
    // floored value plus min is always integral and well below 2^53.
    return ((getValue(key) * (max - min + 1)).floorToDouble() + min).truncate();
  }

  /// Fisher-Yates shuffle with chained Mulberry32 state. Duplicate values
  /// (by string representation) are collapsed before shuffling, so a
  /// caller's slice off the front cannot accidentally produce a repeated
  /// value. Always returns a new list.
  List<T> shuffle<T extends Object>(String key, List<T> items) {
    if (items.length <= 1) {
      return [...items];
    }

    final result = _uniqueByCodePoint(items)..sort(_compareByCodePoint);

    // One chained generator with the same `seed:key` derivation as
    // [getValue], so the first draw equals getValue(key); the remaining
    // n-2 draws continue the same state.
    final prng = Mulberry32(fnv1aHash('$_seed:$key'));

    for (var i = result.length - 1; i > 0; i--) {
      final j = (prng.nextFloat() * (i + 1)).floor();
      final temp = result[i];

      result[i] = result[j];
      result[j] = temp;
    }

    return result;
  }
}

/// JS `String(item)` semantics for dedupe/sort keys: identity for strings,
/// the JS-compatible number formatter for nums (`fontWeight` lists are
/// numeric). Never raw `double.toString()`, which Dart renders as `400.0`
/// where JS prints `400`.
String _jsString(Object item) {
  return item is num ? jsNumString(item) : item.toString();
}

/// Deduplicates by string representation, keeping the first occurrence.
/// Mirrors the cross-language sort key used by [_compareByCodePoint] so that
/// every port collapses the same set of inputs.
List<T> _uniqueByCodePoint<T extends Object>(List<T> items) {
  final seen = <String>{};
  final result = <T>[];

  for (final item in items) {
    if (seen.add(_jsString(item))) {
      result.add(item);
    }
  }

  return result;
}

/// Cross-language deterministic sort: compare by UTF-16 code units of the
/// string representation (JS string `<` compares code units). Dart strings
/// are UTF-16, so [String.compareTo] is exactly this — it agrees with
/// code-point order for all BMP text and differs only for
/// supplementary-plane characters, e.g. "😀" (0xD83D 0xDE00) sorts before
/// U+E000 because 0xD83D < 0xE000.
int _compareByCodePoint(Object a, Object b) {
  return _jsString(a).compareTo(_jsString(b));
}
