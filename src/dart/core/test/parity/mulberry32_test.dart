// The parity fixtures are read from disk via dart:io — VM only.
@TestOn('vm')
library;

import 'dart:convert';

import 'package:dicebear_core/src/prng/mulberry32.dart';
import 'package:test/test.dart';

import 'fixtures.dart';

void main() {
  final fixture = parityFixture('mulberry32.json');

  group(
    'Mulberry32',
    skip: fixture == null ? 'parity fixtures not available' : false,
    () {
      test('float sequences and signed states match the parity fixture', () {
        final cases = jsonDecode(fixture!) as List<Object?>;

        expect(cases, isNotEmpty);

        for (final c in cases) {
          final entry = (c as Map<String, Object?>);
          final seed = (entry['seed'] as num).toInt();
          final sequence = entry['sequence'] as List<Object?>;
          final prng = Mulberry32(seed);

          for (var step = 0; step < sequence.length; step++) {
            final expected = (sequence[step] as Map<String, Object?>);

            // Floats compare with exact `==`; the fixture states are the
            // signed int32 view of the internal state.
            expect(
              prng.nextFloat(),
              (expected['float'] as num).toDouble(),
              reason: 'seed $seed, step $step: float',
            );
            expect(
              prng.state(),
              (expected['state'] as num).toInt(),
              reason: 'seed $seed, step $step: state',
            );
          }
        }
      });
    },
  );
}
