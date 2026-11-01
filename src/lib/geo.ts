import { ServerOption } from "@/types/speed-test";

/**
 * Calculates the great-circle distance between two geographic coordinates
 * using the Haversine formula (in kilometers).
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Finds the nearest server to the given client coordinates.
 */
export function findNearestServer(
  userLat: number,
  userLng: number,
  servers: ServerOption[]
): { server: ServerOption; distanceKm: number } {
  if (servers.length === 0) {
    throw new Error("No servers available for proximity matching");
  }

  let nearest = servers[0];
  let minDistance = Infinity;

  for (const s of servers) {
    const dist = calculateDistanceKm(userLat, userLng, s.lat, s.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = s;
    }
  }

  return { server: nearest, distanceKm: minDistance };
}
