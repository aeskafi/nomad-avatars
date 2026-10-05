// The parity fixtures are read from disk via dart:io — VM only.
@TestOn('vm')
library;

import 'dart:convert';

import 'package:dicebear_core/src/avatar.dart';
import 'package:dicebear_core/src/error/circular_color_reference_error.dart';
import 'package:dicebear_core/src/style.dart';
import 'package:test/test.dart';

import 'fixtures.dart';

// The circularColors cases pin the resolver's reported resolution chain
// through Avatar construction: every port must throw its
// CircularColorReferenceError with exactly the fixture chain.
void main() {
  final fixture = parityFixture('validation.json');

  if (fixture == null) {
    test(
      'circular color parity',
      () {},
      skip: 'parity fixtures not available (run inside the dicebear monorepo)',
    );

    return;
  }

  final cases =
      ((jsonDecode(fixture) as Map<String, Object?>)['circularColors'] as List)
          .cast<Map<String, Object?>>();

  test('fixture covers circular colors', () {
    expect(cases, isNotEmpty);
  });

  for (final c in cases) {
    test(c['id'], () {
      // The style itself is schema-valid; only resolution detects the cycle.
      final style = Style(c['style'] as Map<String, Object?>);
      final chain = (c['chain'] as List).cast<String>();

      try {
        Avatar(style, c['options'] as Map<String, Object?>?);
        fail('expected a CircularColorReferenceError');
      } on CircularColorReferenceError catch (error) {
        expect(error.chain, chain);
        expect(
          error.message,
          'Circular color reference: ${chain.join(' → ')}',
        );
      }
    });
  }
}
