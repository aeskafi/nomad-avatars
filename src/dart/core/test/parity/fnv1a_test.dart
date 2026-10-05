// The parity fixtures are read from disk via dart:io — VM only.
@TestOn('vm')
library;

import 'dart:convert';

import 'package:dicebear_core/src/prng/fnv1a.dart';
import 'package:test/test.dart';

import 'fixtures.dart';

void main() {
  final fixture = parityFixture('fnv1a.json');

  group(
    'fnv1a',
    skip: fixture == null ? 'parity fixtures not available' : false,
    () {
      test('hash and hex match the parity fixture', () {
        final cases = jsonDecode(fixture!) as List<Object?>;

        expect(cases, isNotEmpty);

        for (final c in cases) {
          final entry = (c as Map<String, Object?>);
          final input = entry['input'] as String;

          // Hashes exceed 2^31, so on the web they decode as integral
          // doubles — read through `num`.
          expect(
            fnv1aHash(input),
            (entry['hash'] as num).toInt(),
            reason: 'hash(${jsonEncode(input)})',
          );
          expect(
            fnv1aHex(input),
            entry['hex'] as String,
            reason: 'hex(${jsonEncode(input)})',
          );
        }
      });
    },
  );
}
