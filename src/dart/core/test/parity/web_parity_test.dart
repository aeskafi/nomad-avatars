// Web-platform parity guard. The fixture suites under test/parity are all
// @TestOn('vm') because they read fixtures from disk via dart:io, so the
// dart2js build's number formatting and 32-bit PRNG arithmetic would otherwise
// never be asserted in CI. This suite asserts the same values on both the VM
// and Chrome, where ints are JS doubles and the masking/imul paths matter.
//
// The fixture data is embedded (no dart:io) via the generated
// embedded_fixtures.dart, kept in sync with the canonical fixtures by
// tool/generate_web_fixtures.dart and a CI freshness check.
library;

import 'dart:convert';

import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_core/src/prng/fnv1a.dart';
import 'package:dicebear_core/src/prng/mulberry32.dart';
import 'package:dicebear_core/src/utils/number.dart';
import 'package:test/test.dart';

import 'embedded_fixtures.dart';

void main() {
  test('formatNumber matches the fixture on this platform', () {
    final cases = jsonDecode(numbersJson) as List;

    for (final c in cases) {
      final m = c as Map<String, dynamic>;
      final input = (m['input'] as num).toDouble();

      expect(formatNumber(input), m['output'], reason: 'input ${m['input']}');
    }
  });

  test('fnv1a hash and hex match the fixture on this platform', () {
    final cases = jsonDecode(fnv1aJson) as List;

    for (final c in cases) {
      final m = c as Map<String, dynamic>;
      final input = m['input'] as String;

      expect(fnv1aHash(input), (m['hash'] as num).toInt(),
          reason: 'hash of ${jsonEncode(input)}');
      expect(fnv1aHex(input), m['hex'], reason: 'hex of ${jsonEncode(input)}');
    }
  });

  test('mulberry32 sequence and signed state match the fixture', () {
    final cases = jsonDecode(mulberry32Json) as List;

    for (final c in cases) {
      final m = c as Map<String, dynamic>;
      final prng = Mulberry32((m['seed'] as num).toInt());

      for (final step in m['sequence'] as List) {
        final s = step as Map<String, dynamic>;

        expect(prng.nextFloat(), (s['float'] as num).toDouble(),
            reason: 'seed ${m['seed']}');
        expect(prng.state(), (s['state'] as num).toInt(),
            reason: 'seed ${m['seed']} signed state');
      }
    }
  });

  test('glass avatars render byte-identically on this platform', () {
    final style = Style.parse(glassStyle);
    final cases = jsonDecode(glassAvatars) as List;

    for (final c in cases) {
      final m = c as Map<String, dynamic>;
      final options = ((m['options'] ?? <String, Object?>{}) as Map)
          .cast<String, Object?>();
      final avatar = Avatar(style, options);

      expect(avatar.svg, m['svg'], reason: 'svg of ${m['id']}');
      expect(jsonEncode(avatar.toJson()['options']),
          jsonEncode(m['resolvedOptions']),
          reason: 'resolvedOptions of ${m['id']}');

      if (m.containsKey('dataUri')) {
        expect(avatar.toDataUri(), m['dataUri'],
            reason: 'dataUri of ${m['id']}');
      }
    }
  });
}
