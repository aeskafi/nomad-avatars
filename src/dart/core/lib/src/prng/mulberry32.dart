/// Mulberry32 PRNG.
library;

import 'fnv1a.dart';

const int _mask32 = 0xFFFFFFFF;

/// 2^32, the divisor that maps an unsigned 32-bit value into `[0, 1)`.
const int _uint32MaxPlus1 = 4294967296;

/// Mulberry32 PRNG — stateful, matching the C reference by Tommy Ettinger.
///
/// C original:
///
/// ```c
/// uint32_t z = (x += 0x6D2B79F5UL);
/// z = (z ^ (z >> 15)) * (z | 1UL);
/// z ^= z + (z ^ (z >> 7)) * (z | 61UL);
/// return z ^ (z >> 14);
/// ```
///
/// All arithmetic is unsigned 32-bit: the state is kept in `[0, 2^32)` at all
/// times, every addition is masked with `& 0xFFFFFFFF` before its result is
/// used, and multiplication goes through [imul32]. This reproduces the JS
/// reference's `Math.imul` / `>>>` / `| 0` behaviour exactly on both the VM
/// and the web.
///
/// See https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
class Mulberry32 {
  int _state;

  /// Creates a generator from an unsigned 32-bit [seed] (in practice always
  /// an FNV-1a hash, which may exceed 2^31 — e.g. 4294967295).
  Mulberry32(int seed) : _state = seed & _mask32;

  /// Advances the state and returns the next unsigned 32-bit value.
  int next() {
    final z = _state = (_state + 0x6d2b79f5) & _mask32;

    var t = imul32(z ^ (z >>> 15), z | 1);
    // The inner sum must be reduced mod 2^32 before the XOR: JS `^` applies
    // ToInt32 to the unbounded double sum.
    t ^= (t + imul32(t ^ (t >>> 7), t | 61)) & _mask32;

    return t ^ (t >>> 14);
  }

  /// Advances the state and returns the next value in `[0, 1)`.
  ///
  /// Dividing an exact integer below 2^32 by 2^32 is exact in IEEE-754
  /// doubles, so the result is bit-identical across the language ports.
  double nextFloat() {
    return next() / _uint32MaxPlus1;
  }

  /// Returns the current internal state as a signed 32-bit value, matching
  /// the JS reference where the state is stored via `| 0`. Exercised by the
  /// parity tests.
  int state() {
    return _state.toSigned(32);
  }
}
