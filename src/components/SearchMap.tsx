import { useEffect } from 'react'
import { Circle, CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import { SEARCH_RADIUS_M, type LatLng } from '../lib/geo'
import { formatDistance } from '../lib/geo'
import type { Parking } from '../types'

type Nearby = {
  parking: Parking
  distance: number
}

function MapViewport({ center }: { center: LatLng }) {
  const map = useMap()

  useEffect(() => {
    map.flyTo([center.lat, center.lng], map.getZoom(), { duration: 0.6 })
  }, [center, map])

  return null
}

export function SearchMap({
  center,
  items,
  onOpen,
}: {
  center: LatLng
  items: Nearby[]
  onOpen: (id: string) => void
}) {
  return (
    <MapContainer
      className="search-map"
      center={[center.lat, center.lng]}
      zoom={15}
      scrollWheelZoom
      zoomControl
    >
      <MapViewport center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle
        center={[center.lat, center.lng]}
        radius={SEARCH_RADIUS_M}
        pathOptions={{
          color: '#3d9a8c',
          fillColor: '#7ec9b8',
          fillOpacity: 0.2,
          dashArray: '8 10',
        }}
      />
      {items.map(({ parking, distance }) => {
        const busy = parking.occupancy.free === 0
        return (
          <CircleMarker
            key={parking.id}
            center={[parking.lat, parking.lng]}
            radius={10}
            pathOptions={{
              color: '#fff',
              weight: 3,
              fillColor: busy ? '#e07a7a' : '#1b7a74',
              fillOpacity: 1,
            }}
          >
            <Popup>
              <div className="pv-marker-card">
                <div className="pv-marker-title">{parking.name}</div>
                <div className="pv-marker-meta">
                  <span>{formatDistance(distance)}</span>
                  <span className={`pv-marker-badge ${busy ? 'is-busy' : 'is-free'}`}>
                    {busy ? 'Занято' : `${parking.occupancy.free} своб.`}
                  </span>
                </div>
                <button
                  type="button"
                  className="pv-marker-open"
                  onClick={() => onOpen(parking.id)}
                >
                  Открыть схему
                </button>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
