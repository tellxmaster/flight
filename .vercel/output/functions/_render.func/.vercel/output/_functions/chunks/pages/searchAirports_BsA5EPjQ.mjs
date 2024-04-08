class Cache {
  store = {};
  set(key, value, ttl) {
    const now = Date.now();
    const expire = now + ttl * 1e3;
    this.store[key] = { value, expire };
  }
  get(key) {
    const item = this.store[key];
    if (item) {
      const now = Date.now();
      if (now < item.expire) {
        return item.value;
      } else {
        delete this.store[key];
      }
    }
    return null;
  }
}
const cache = new Cache();

async function fetchNewToken(client_id, client_secret) {
  const response = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id,
        client_secret
      })
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch the access token");
  }
  const data = await response.json();
  cache.set("authToken", data.access_token, data.expires_in);
}
function isTokenExpired(token) {
  const now = Date.now();
  return now >= token.expire;
}

const GET = async ({ request }) => {
  const url = new URL(request.url);
  const keyword = url.searchParams.get("keyword") || "QUITO";
  let endpoint = `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${encodeURIComponent(
    keyword
  )}&page[limit]=10&page[offset]=0&view=FULL`;
  let accessToken = cache.get("authToken");
  if (!accessToken || isTokenExpired(accessToken)) {
    await fetchNewToken(
      process.env.AMADEUS_API_KEY,
      process.env.AMADEUS_API_SECRET
    );
    accessToken = cache.get("authToken");
  }
  const airportsResponse = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!airportsResponse.ok) {
    throw new Error(`Error fetching airports: ${airportsResponse.statusText}`);
  }
  const airportsData = await airportsResponse.json();
  return new Response(JSON.stringify(airportsData), {
    headers: { "Content-Type": "application/json" }
  });
};

const searchAirports_json = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

export { cache as c, fetchNewToken as f, isTokenExpired as i, searchAirports_json as s };
