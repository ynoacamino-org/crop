export interface RelationalStore {
  readonly client: unknown;
  close?(): Promise<void>;
}
