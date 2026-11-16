import type { LatLng } from './geo'

type GeocodingResult = {
  lat: string
  lon: string
}

const requests = new Map<string, Promise<LatLng | null>>()

export function geocode(query: string): Promise<LatLng | null> {
  const key = query.trim().toLowerCase()
  const existing = requests.get(key)
  if (existing) return existing

  const params = new URLSearchParams({
    format: 'jsonv2',
    limit: '1',
    q: query.trim(),
  })

  const request = fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Geocoding request failed with status ${response.status}`)
      }
      return response.json() as Promise<GeocodingResult[]>
    })
    .then((results) => {
      const result = results[0]
      if (!result) return null

      const lat = Number(result.lat)
      const lng = Number(result.lon)
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        throw new Error('Geocoding service returned invalid coordinates')
      }

      return { lat, lng }
    })

  requests.set(key, request)
  void request.catch(() => requests.delete(key))
  return request
}
