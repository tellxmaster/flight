export interface Flight {
  id: string;
  source: string;
  destination: string;
  itineraries: Array<{
    segments: Array<{
      departureAt: string;
      arrivalAt: string;
    }>;
  }>;
  priceTotal: string;
  currency: string;
}
