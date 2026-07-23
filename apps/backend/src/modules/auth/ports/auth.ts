export interface AuthPort {
  api: {
    getSession: (opts: { headers: Headers }) => Promise<{
      user?: {
        id: string;
        email: string;
        name?: string | null;
        role?: string;
      };
      session?: unknown;
    } | null>;
  };
  handler: (request: Request) => Promise<Response>;
}
