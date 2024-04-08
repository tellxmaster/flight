import { fetchNewToken, isTokenExpired } from "@utils/authToken";
import { cache } from "@utils/cache";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const keyword = url.searchParams.get("keyword") || "QUITO";

  let endpoint = `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${encodeURIComponent(
    keyword
  )}&page[limit]=10&page[offset]=0&view=FULL`;

  let accessToken = cache.get("authToken");
  if (!accessToken || isTokenExpired(accessToken)) {
    await fetchNewToken(
      import.meta.env.AMADEUS_API_KEY as string,
      import.meta.env.AMADEUS_API_SECRET as string
    );
    accessToken = cache.get("authToken");
  }

  const airportsResponse = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!airportsResponse.ok) {
    // Manejo de errores si la respuesta no es satisfactoria
    throw new Error(`Error fetching airports: ${airportsResponse.statusText}`);
  }

  const airportsData = await airportsResponse.json();

  return new Response(JSON.stringify(airportsData), {
    headers: { "Content-Type": "application/json" },
  });
};
