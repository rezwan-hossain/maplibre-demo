export interface BarikoiAddressComponents {
  place_name: string | null;
  house: string | null;
  road: string | null;
}

export interface BarikoiAreaComponents {
  area: string;
  sub_area: string;
}

export interface BarikoireverceLocation {
  id: number;
  distance_within_meters: number;
  address: string;
  area: string;
  city: string;
  postCode?: string;
  address_bn?: string;
  area_bn: string;
  city_bn: string;
  country: string;
  division: string;
  district: string;
  sub_district: string;
  pauroshova: string | null;
  union: string | null;
  location_type: string;
  address_components: BarikoiAddressComponents;
  area_components: BarikoiAreaComponents;
  thana: string;
  thana_bn: string;
}

export interface BarikoiReverseGeocodeResponse {
  place: BarikoireverceLocation;
  status: number;
}

export async function reverseGeocode2(
  lat: number,
  lon: number
): Promise<BarikoiReverseGeocodeResponse> {
  const API_KEY = import.meta.env.VITE_BARIKOI_API_KEY; // Ensure your API key is in your .env

  // Define which optional components you want Barikoi to return
  const params = new URLSearchParams({
    api_key: API_KEY,
    longitude: lon.toString(),
    latitude: lat.toString(),
    district: "true",
    post_code: "true",
    country: "true",
    sub_district: "true",
    division: "true",
    address: "true",
    area: "true",
    bangla: "true",
    thana: "true",
    country_code: "bd",
  });

  const response = await fetch(
    `https://barikoi.xyz/v2/api/search/reverse/geocode?${params.toString()}`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Failed to fetch Barikoi reverse geocode data"
    );
  }

  const data: BarikoiReverseGeocodeResponse = await response.json();

  if (data.status !== 200) {
    throw new Error(`Barikoi : ${data.status}`);
  }

  return data;
}
