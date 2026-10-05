// The parity fixtures are read from disk via dart:io — VM only.
@TestOn('vm')
library;

import 'dart:convert';

import 'package:dicebear_core/src/utils/initials.dart';
import 'package:test/test.dart';

import 'fixtures.dart';

void main() {
  final fixture = parityFixture('initials.json');

  group(
    'initialsFromSeed',
    skip: fixture == null ? 'parity fixtures not available' : false,
    () {
      test('matches the parity fixture', () {
        final cases = (jsonDecode(fixture!) as List<Object?>)
            .cast<Map<String, Object?>>();

        expect(cases, isNotEmpty);

        for (final e in cases) {
          final seed = e['seed'] as String;

          // jsonEncode the seed in the failure reason — the fixture includes
          // control characters (CR, U+2028, U+2029 after `@`) that would
          // garble plain interpolation.
          expect(
            initialsFromSeed(seed),
            e['result'] as String,
            reason: 'initialsFromSeed(${jsonEncode(seed)})',
          );
        }
      });
    },
  );
}
