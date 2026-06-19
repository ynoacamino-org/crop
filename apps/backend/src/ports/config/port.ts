export interface EnvStore {
  get(key: string): string | undefined;
  getRequired(key: string): string;
  all(): Record<string, string | undefined>;
}
