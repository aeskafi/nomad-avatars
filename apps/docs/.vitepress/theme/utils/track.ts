/** Fire a privacy-safe Umami event. No-ops when Umami is absent (e.g. dev). */
export function track(event: string, data?: Record<string, string>): void {
  if (typeof umami !== 'undefined') {
    umami.track(event, data);
  }
}

/** Collapse custom styles to a non-identifying label; never leak user-typed names. */
export function styleLabel(name: string): string {
  return name.startsWith('custom:') ? 'custom' : name;
}
