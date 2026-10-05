/// Derives display initials from a seed string.
///
/// Words are split by Unicode letter/mark classes (`\p{L}`, `\p{M}`) so the
/// result matches the JS, PHP, Python, Rust and Go ports for accented and
/// non-Latin input. See https://www.regular-expressions.info/unicode.html
library;

import 'uppercase.dart';

/// `@…` — the entire suffix (e.g. an email domain), stripped so the local
/// part yields one word. `dotAll` makes `.` match line terminators too, so
/// the whole tail is removed — matching the dotall `@.*` strip in every port.
final _atSuffix = RegExp('@.*', dotAll: true);

/// Apostrophes and accents that should not break a word (e.g. `l'eau`,
/// `d´or`): U+0060, U+00B4, U+0027, U+02BC.
final _apostrophes = RegExp("[`´'ʼ]");

/// A word: a letter followed by any letters or combining marks.
final _word = RegExp(r'\p{L}[\p{L}\p{M}]*', unicode: true);

/// The first one or two letter+marks units of a word.
final _oneOrTwoUnits = RegExp(r'^(?:\p{L}\p{M}*){1,2}', unicode: true);

/// The first single letter+marks unit of a word.
final _oneUnit = RegExp(r'^(?:\p{L}\p{M}*)', unicode: true);

/// Returns one or two uppercase initials for the given seed. By default
/// strips `@...` so email addresses yield a single initial instead of being
/// treated as two words.
///
/// Uppercasing goes through [jsToUpperCase] for full Unicode case mapping
/// (ß→SS, ﬁ→FI): Dart's `String.toUpperCase` only maps 1:1 on the VM, which
/// would diverge from the JS reference — and from this package's own dart2js
/// build (Go needed `golang.org/x/text/cases` for the same reason).
String initialsFromSeed(String seed, [bool discardAtSymbol = true]) {
  var input = seed;

  if (discardAtSymbol) {
    // JS `replace(/@.*/s, '')` has no `g` flag — only the first match. With
    // dotall, `@.*` reaches the end of the string anyway.
    input = seed.replaceFirst(_atSuffix, '');
  }

  input = input.replaceAll(_apostrophes, '');

  final matches = _word.allMatches(input).toList();

  if (matches.isEmpty) {
    // Stripping the @ suffix left no words at all (e.g. a seed starting with
    // `@`) — retry once on the full seed.
    return discardAtSymbol ? initialsFromSeed(seed, false) : '';
  }

  if (matches.length == 1) {
    final match = _oneOrTwoUnits.firstMatch(matches[0][0]!);

    return match != null ? jsToUpperCase(match[0]!) : '';
  }

  final first = _oneUnit.firstMatch(matches.first[0]!);
  final last = _oneUnit.firstMatch(matches.last[0]!);

  if (first == null || last == null) {
    return '';
  }

  return jsToUpperCase(first[0]! + last[0]!);
}
