// The parity fixtures are read from disk via dart:io — VM only.
@TestOn('vm')
library;

import 'dart:convert';

import 'package:dicebear_core/src/utils/number.dart';
import 'package:test/test.dart';

import 'fixtures.dart';

void main() {
  final fixture = parityFixture('numbers.json');

  group(
    'formatNumber',
    skip: fixture == null ? 'parity fixtures not available' : false,
    () {
      test('matches the parity fixture', () {
        final cases = jsonDecode(fixture!) as List<Object?>;

        expect(cases, isNotEmpty);

        for (final c in cases) {
          final entry = (c as Map<String, Object?>);

          // The VM decodes `0`, `1`, `4096`, … as int — normalize through
          // `num` like every other JSON boundary.
          expect(
            formatNumber((entry['input'] as num).toDouble()),
            entry['output'] as String,
            reason: 'formatNumber(${jsonEncode(entry['input'])})',
          );
        }
      });
    },
  );
}
