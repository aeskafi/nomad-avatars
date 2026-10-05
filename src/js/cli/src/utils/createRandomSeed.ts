/**
 * Returns a short, base-36-encoded random string suitable as an ad-hoc avatar
 * seed. Uses `Math.random()` — not cryptographically secure, but sufficient
 * for generating distinct sample avatars from the CLI.
 */
export function createRandomSeed() {
  return Math.random().toString(36).substring(2);
}
