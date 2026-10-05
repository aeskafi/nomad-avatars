/// FNV-1a 32-bit hash.
///
/// Offset basis: 0x811c9dc5, prime: 0x01000193.
///
/// See https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function
library;

const int _mask32 = 0xFFFFFFFF;

/// Reproduces JavaScript's `Math.imul`: `(a * b) mod 2^32` for operands
/// already in `[0, 2^32)`.
///
/// The 16-bit limb split keeps every intermediate below 2^33, which is exact
/// in JS doubles — on the web a plain `a * b` of two 32-bit values loses
/// precision above 2^53 and would silently corrupt the hash, while on the VM
/// it would be correct but only by accident of 64-bit wrapping.
int imul32(int a, int b) {
  final aLo = a & 0xFFFF;
  final aHi = (a >>> 16) & 0xFFFF;
  final bLo = b & 0xFFFF;
  final bHi = (b >>> 16) & 0xFFFF;

  // (a*b) mod 2^32 = aLo*bLo + ((aHi*bLo + aLo*bHi) mod 2^16) << 16 (mod 2^32)
  return ((aLo * bLo) + (((aHi * bLo + aLo * bHi) & 0xFFFF) << 16)) & _mask32;
}

/// Returns the unsigned 32-bit FNV-1a hash of [input].
///
/// The input is hashed by its UTF-16 code units (matching JS `charCodeAt`),
/// so the result is identical across the language ports even for non-ASCII
/// or non-BMP seeds. Dart strings are UTF-16 already, so [String.codeUnits]
/// is iterated directly — a non-BMP character like 🎲 contributes two units
/// (its surrogate pair). [imul32] wraps mod 2^32, reproducing JS
/// `Math.imul` / `>>> 0`.
int fnv1aHash(String input) {
  var hash = 0x811c9dc5;

  for (final code in input.codeUnits) {
    // No mask needed on the XOR: code <= 0xFFFF and hash < 2^32.
    hash = imul32(hash ^ code, 0x01000193);
  }

  return hash;
}

/// Returns the FNV-1a hash of [input] as an 8-character lowercase hex string.
String fnv1aHex(String input) {
  return fnv1aHash(input).toRadixString(16).padLeft(8, '0');
}
