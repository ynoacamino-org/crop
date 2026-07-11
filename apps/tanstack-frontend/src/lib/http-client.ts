import ky from "ky";
import { env } from "#/env";

export const http = ky.create({
  prefixUrl: env.VITE_API_URL,
  credentials: "include",
});
