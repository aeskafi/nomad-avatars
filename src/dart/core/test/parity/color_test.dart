// The parity fixtures are read from disk via dart:io — VM only.
@TestOn('vm')
library;

import 'dart:convert';

import 'package:dicebear_core/src/utils/color.dart';
import 'package:test/test.dart';

import 'fixtures.dart';

void main() {
  final fixture = parityFixture('colors.json');

  group(
    'Color',
    skip: fixture == null ? 'parity fixtures not available' : false,
    () {
      late Map<String, Object?> root;

      setUpAll(() {
        root = jsonDecode(fixture!) as Map<String, Object?>;
      });

      List<Map<String, Object?>> cases(String section) {
        final list =
            (root[section] as List<Object?>).cast<Map<String, Object?>>();

        expect(list, isNotEmpty, reason: section);

        return list;
      }

      test('toHex', () {
        for (final e in cases('toHex')) {
          expect(
            Color.toHex(e['input'] as String),
            e['result'] as String,
            reason: 'toHex(${e['input']})',
          );
        }
      });

      test('toRgbHex', () {
        for (final e in cases('toRgbHex')) {
          expect(
            Color.toRgbHex(e['input'] as String),
            e['result'] as String,
            reason: 'toRgbHex(${e['input']})',
          );
        }
      });

      test('parseHex', () {
        for (final e in cases('parseHex')) {
          expect(
            Color.parseHex(e['input'] as String),
            [for (final v in e['result'] as List<Object?>) (v as num).toInt()],
            reason: 'parseHex(${e['input']})',
          );
        }
      });

      test('luminance', () {
        for (final e in cases('luminance')) {
          // Exact equality: the LUT-based luminance is bit-identical across
          // ports. The `0`/`1` endpoints are JSON ints — normalize through
          // `num` like every other JSON boundary.
          expect(
            Color.luminance(e['input'] as String),
            (e['result'] as num).toDouble(),
            reason: 'luminance(${e['input']})',
          );
        }
      });

      test('sortByContrast', () {
        for (final e in cases('sortByContrast')) {
          final candidates = (e['candidates'] as List<Object?>).cast<String>();
          final input = [...candidates];

          // Order-sensitive: the equal-ratio case pins the stable sort.
          expect(
            Color.sortByContrast(candidates, e['refColor'] as String),
            (e['result'] as List<Object?>).cast<String>(),
            reason:
                'sortByContrast(${jsonEncode(candidates)}, ${e['refColor']})',
          );

          // Sorting must return a new list, never mutate the caller's.
          expect(candidates, input, reason: 'input list mutated');
        }
      });

      test('filterNotEqualTo', () {
        for (final e in cases('filterNotEqualTo')) {
          final candidates = (e['candidates'] as List<Object?>).cast<String>();
          final excluded = (e['excluded'] as List<Object?>).cast<String>();

          expect(
            Color.filterNotEqualTo(candidates, excluded),
            (e['result'] as List<Object?>).cast<String>(),
            reason: 'filterNotEqualTo(${jsonEncode(candidates)}, '
                '${jsonEncode(excluded)})',
          );
        }
      });
    },
  );
}
