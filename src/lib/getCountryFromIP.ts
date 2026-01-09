// src/lib/getCountryFromIP.ts
export async function getCountryFromIP(): Promise<string | null> {
  try {
    const res = await fetch("https://ipwho.is/");
    const data = await res.json();

    if (!data.success || !data.country_code) return null;

    return data.country_code.toLowerCase(); // "bd", "us", etc.
  } catch {
    return null;
  }
}
