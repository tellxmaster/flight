import { c as cache, i as isTokenExpired, f as fetchNewToken } from './searchAirports_BsA5EPjQ.mjs';

const POST = async ({ request }) => {
  const formData = await request.formData();
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
  const tripType = formData.get("tripType");
  const origin = formData.get("origin_code");
  const destination = formData.get("destination_code");
  const outgoingDate = formData.get("outgoing_date");
  const returnDate = formData.get("return_date");
  let endpoint = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${outgoingDate}&adults=1`;
  if (tripType === "roundTrip" && returnDate) {
    endpoint += `&returnDate=${returnDate}`;
  }
  let accessToken = cache.get("authToken");
  if (!accessToken || isTokenExpired(accessToken)) {
    await fetchNewToken(
      process.env.AMADEUS_API_KEY,
      process.env.AMADEUS_API_SECRET
    );
    accessToken = cache.get("authToken");
  }
  const amadeusResponse = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const flights = await amadeusResponse.json();
  const processedFlights = flights.data.map((flight) => {
    return {
      id: flight.id,
      source: flight.source,
      instantTicketingRequired: flight.instantTicketingRequired,
      nonHomogeneous: flight.nonHomogeneous,
      oneWay: flight.oneWay,
      lastTicketingDate: flight.lastTicketingDate,
      numberOfBookableSeats: flight.numberOfBookableSeats,
      itineraries: flight.itineraries.map((itinerary) => {
        return {
          duration: itinerary.duration,
          segments: itinerary.segments.map((segment) => {
            return {
              departureIataCode: segment.departure.iataCode,
              departureAt: segment.departure.at,
              arrivalIataCode: segment.arrival.iataCode,
              arrivalAt: segment.arrival.at,
              carrierCode: segment.carrierCode,
              number: segment.number,
              aircraftCode: segment.aircraft.code,
              numberOfStops: segment.numberOfStops,
              duration: segment.duration
            };
          })
        };
      }),
      priceTotal: flight.price.total,
      currency: flight.price.currency,
      dictionaries: flight.dictionaries
    };
  });
  return new Response(JSON.stringify(processedFlights), {
    headers: { "Content-Type": "application/json" }
  });
};

export { POST };
