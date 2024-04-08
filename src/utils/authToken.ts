import type { TokenResponse } from "@interfaces/TokenResponse";
import { cache } from "./cache";
import type { CacheItem } from "@interfaces/CacheItem";

let cachedToken: TokenResponse = {
  access_token: "",
  token_type: "",
  expires_in: 0,
};

export async function fetchNewToken(
  client_id: string,
  client_secret: string
): Promise<void> {
  const response = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: client_id,
        client_secret: client_secret,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch the access token");
  }

  const data: TokenResponse = await response.json();

  cache.set("authToken", data.access_token, data.expires_in);
}

export function isTokenExpired(token: CacheItem): boolean {
  const now = Date.now();
  return now >= token.expire;
}
