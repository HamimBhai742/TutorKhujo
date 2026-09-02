import { NextRequest, NextResponse } from "next/server";

interface LocationResult {
  displayName: string;
  subTitle?: string;
  lat?: string;
  lon?: string;
}

interface NominatimItem {
  name?: string;
  lat?: string;
  lon?: string;
  address?: {
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    residential?: string;
    commercial?: string;
    road?: string;
    city?: string;
    town?: string;
    county?: string;
    state_district?: string;
    state?: string;
  };
}

interface PhotonFeature {
  properties?: {
    country?: string;
    countrycode?: string;
    name?: string;
    street?: string;
    city?: string;
    district?: string;
    county?: string;
    state?: string;
  };
  geometry?: {
    coordinates?: [number, number];
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ success: true, data: [] });
  }

  const results: LocationResult[] = [];
  const seenNames = new Set<string>();

  // 1. Primary: Query OpenStreetMap Nominatim with Bangladesh restriction
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&countrycodes=bd&format=json&addressdetails=1&accept-language=en&limit=8`;

    const res = await fetch(nominatimUrl, {
      headers: {
        "User-Agent": "TutorKhojo-Platform/1.0 (contact@tutorkhojo.com)",
        "Accept": "application/json",
      },
    });

    if (res.ok) {
      const data: NominatimItem[] = await res.json();
      if (Array.isArray(data)) {
        data.forEach((item) => {
          const addr = item.address || {};
          const primary =
            addr.suburb ||
            addr.neighbourhood ||
            addr.quarter ||
            addr.residential ||
            addr.commercial ||
            addr.road ||
            item.name;

          const district =
            addr.city ||
            addr.town ||
            addr.county ||
            addr.state_district ||
            addr.state ||
            "";

          const division = addr.state || "Bangladesh";

          if (primary) {
            let title = primary;
            if (district && !primary.toLowerCase().includes(district.toLowerCase())) {
              title = `${primary}, ${district}`;
            }

            const cleanTitle = title.trim();
            if (cleanTitle && !seenNames.has(cleanTitle.toLowerCase())) {
              seenNames.add(cleanTitle.toLowerCase());
              results.push({
                displayName: cleanTitle,
                subTitle: `${division}, Bangladesh`,
                lat: item.lat,
                lon: item.lon,
              });
            }
          }
        });
      }
    }
  } catch (err) {
    console.warn("Nominatim route error:", err);
  }

  // 2. Secondary Fallback: Photon Komoot OpenStreetMap Geocoder
  if (results.length < 4) {
    try {
      const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(
        query + " bangladesh"
      )}&limit=8`;

      const photonRes = await fetch(photonUrl);
      if (photonRes.ok) {
        const photonData = await photonRes.json();
        const features: PhotonFeature[] = photonData?.features || [];

        features.forEach((feat) => {
          const props = feat.properties || {};
          const country = props.country || "";
          const countryCode = props.countrycode || "";

          // Only keep Bangladesh results
          if (
            country.toLowerCase().includes("bangladesh") ||
            countryCode.toUpperCase() === "BD"
          ) {
            const name = props.name || props.street || "";
            const city = props.city || props.district || props.county || "";
            const state = props.state || "Bangladesh";

            if (name) {
              let title = name;
              if (city && !name.toLowerCase().includes(city.toLowerCase())) {
                title = `${name}, ${city}`;
              }

              const cleanTitle = title.trim();
              if (cleanTitle && !seenNames.has(cleanTitle.toLowerCase())) {
                seenNames.add(cleanTitle.toLowerCase());
                results.push({
                  displayName: cleanTitle,
                  subTitle: `${state}, Bangladesh`,
                  lat: feat.geometry?.coordinates?.[1]?.toString(),
                  lon: feat.geometry?.coordinates?.[0]?.toString(),
                });
              }
            }
          }
        });
      }
    } catch (photonErr) {
      console.warn("Photon fallback error:", photonErr);
    }
  }

  return NextResponse.json({ success: true, data: results.slice(0, 8) });
}
