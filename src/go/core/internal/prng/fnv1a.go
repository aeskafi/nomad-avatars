package prng

import (
	"fmt"
	"unicode/utf16"
)

// FNV-1a 32-bit hash.
//
// Offset basis: 0x811c9dc5, prime: 0x01000193.
//
// See https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function

// Hash returns the unsigned 32-bit FNV-1a hash of input.
//
// The input is hashed by its UTF-16 code units (matching JS charCodeAt), so the
// result is identical across the language ports even for non-ASCII or non-BMP
// seeds. uint32 arithmetic wraps on overflow, reproducing JS Math.imul / >>> 0.
func Hash(input string) uint32 {
	hash := uint32(0x811c9dc5)

	for _, code := range utf16.Encode([]rune(input)) {
		hash ^= uint32(code)
		hash *= 0x01000193
	}

	return hash
}

// Hex returns the FNV-1a hash of input as an 8-character lowercase hex string.
func Hex(input string) string {
	return fmt.Sprintf("%08x", Hash(input))
}
