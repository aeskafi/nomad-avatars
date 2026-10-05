export interface DefinitionElement {
  type(): string;
  name(): string | undefined;
  value(): unknown;
  attributes(): Record<string, unknown> | undefined;
  children(): readonly DefinitionElement[];
}
