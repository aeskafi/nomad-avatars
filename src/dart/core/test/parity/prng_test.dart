// The parity fixtures are read from disk via dart:io — VM only.
@TestOn('vm')
library;

import 'dart:convert';

import 'package:dicebear_core/src/prng/prng.dart';
import 'package:dicebear_core/src/range.dart';
import 'package:test/test.dart';

import 'fixtures.dart';

void main() {
  final fixture = parityFixture('prng.json');

  group(
    'Prng',
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

      test('getValue', () {
        for (final e in cases('getValue')) {
          expect(
            Prng(e['seed'] as String).getValue(e['key'] as String),
            (e['result'] as num).toDouble(),
            reason: '${e['seed']}:${e['key']}',
          );
        }
      });

      test('pick', () {
        for (final e in cases('pick')) {
          final items = (e['items'] as List<Object?>).cast<String>();

          expect(
            Prng(e['seed'] as String).pick(e['key'] as String, items),
            e['result'] as String?,
            reason: '${e['seed']}:${e['key']} ${jsonEncode(items)}',
          );
        }
      });

      test('weightedPick', () {
        for (final e in cases('weightedPick')) {
          // Weight values mix int and double literals; normalize through
          // `num` while keeping the JSON insertion order.
          final weights = (e['weights'] as Map<String, Object?>).map(
            (k, v) => MapEntry(k, (v as num).toDouble()),
          );

          expect(
            Prng(e['seed'] as String).weightedPick(
              e['key'] as String,
              weights,
            ),
            e['result'] as String?,
            reason: '${e['seed']}:${e['key']} ${jsonEncode(e['weights'])}',
          );
        }
      });

      test('boolean', () {
        for (final e in cases('bool')) {
          expect(
            Prng(e['seed'] as String).boolean(
              e['key'] as String,
              (e['likelihood'] as num).toDouble(),
            ),
            e['result'] as bool,
            reason: '${e['seed']}:${e['key']} ${e['likelihood']}',
          );
        }
      });

      test('float', () {
        for (final e in cases('float')) {
          expect(
            Prng(e['seed'] as String).float(
              e['key'] as String,
              _range(e['range']),
            ),
            // The fixture mixes int results (`15`, `42`) with doubles.
            (e['result'] as num).toDouble(),
            reason: '${e['seed']}:${e['key']} ${jsonEncode(e['range'])}',
          );
        }
      });

      test('integer', () {
        for (final e in cases('integer')) {
          expect(
            Prng(e['seed'] as String).integer(
              e['key'] as String,
              _range(e['range']),
            ),
            (e['result'] as num).toInt(),
            reason: '${e['seed']}:${e['key']} ${jsonEncode(e['range'])}',
          );
        }
      });

      test('shuffle', () {
        for (final e in cases('shuffle')) {
          final items = (e['items'] as List<Object?>).cast<String>();
          final input = [...items];

          expect(
            Prng(e['seed'] as String).shuffle(e['key'] as String, items),
            (e['result'] as List<Object?>).cast<String>(),
            reason: '${e['seed']}:${e['key']} ${jsonEncode(items)}',
          );

          // Shuffle must return a new list, never mutate the caller's.
          expect(items, input, reason: 'input list mutated');
        }
      });
    },
  );
}

/// Builds a [Range] from a fixture object; `step` may be absent.
Range _range(Object? raw) {
  final map = raw as Map<String, Object?>;

  return Range(
    min: (map['min'] as num).toDouble(),
    max: (map['max'] as num).toDouble(),
    step: (map['step'] as num?)?.toDouble(),
  );
}
