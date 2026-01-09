import { Dhaka } from "./constant";

interface Timezone {
  id?: string;
  current_time?: string;
  utc_offset?: string;
}

interface Connection {
  isp?: string;
  org?: string;
  asn?: number;
}

interface Flag {
  img?: string;
  emoji?: string;
}

export interface IpWhoIsResponse {
  About_Us: string;
  ip: string;
  success: boolean;
  type: "IPv4" | "IPv6";

  continent: string;
  continent_code: string;

  country: string;
  country_code: string;

  region: string;
  region_code: string;

  city: string;
  latitude: number;
  longitude: number;

  is_eu: boolean;
  postal: string;

  calling_code: string;
  capital: string;
  borders: string;

  flag: Timezone;
  connection: Connection;
  timezone: Flag;
  //   timezone: Record<string, unknown>;
}

interface Address {
  road?: string;
  quarter?: string;
  suburb?: string;
  city?: string;
  county?: string;
  state_district?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}

export interface ReverseGeocodeResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: Address;
  boundingbox: [string, string, string, string];
}

export type SearchResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export async function getLocation(): Promise<[number, number]> {
  try {
    const response = await fetch("https://ipwho.is/");
    const json = (await response.json()) as IpWhoIsResponse;

    if (
      response.ok &&
      json.success === true &&
      typeof json.latitude === "number" &&
      typeof json.longitude === "number"
    ) {
      return [json.longitude, json.latitude];
    }
  } catch {
    // intentionally ignored
  }

  return Dhaka;
}

export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<ReverseGeocodeResponse> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reverse geocode data");
  }

  const data: ReverseGeocodeResponse = await response.json();
  return data;
}

export async function searchPlaces(
  query: string,
  countryCode?: string
): Promise<SearchResult[]> {
  if (!query) return [];

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&countrycodes=${
      countryCode ?? "bd"
    }&q=${encodeURIComponent(query)}&limit=5`
  );

  return res.json();
}
