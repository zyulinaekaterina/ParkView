import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { UserMenu } from '../components/UserMenu'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { getParkingById } from '../data/parkings'
import type { Spot } from '../types'

export function SchemePage() {
  const { user } = useAuth()
  const { id } = useParams()
  const parking = id ? getParkingById(id) : undefined
  const { isFavorite, toggle } = useFavorites()
  const [selectedId, setSelectedId] = useState<string | null>('B-6')

  const selected = useMemo(() => {
    if (!parking || !selectedId) return null
    return parking.rows.flat().find((spot) => spot.id === selectedId) ?? null
  }, [parking, selectedId])

  if (!parking) return <Navigate to="/" replace />

  const current = parking
  const ratio = current.occupancy.free / current.occupancy.total
  const favorite = isFavorite(current.id)

  function openRoute() {
    const url = `https://yandex.ru/maps/?rtext=~${current.lat},${current.lng}&rtt=auto`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="scheme-page">
      <header className="scheme-header">
        <div className="scheme-header-left">
          <nav className="crumbs">
            <Link to="/">Главная</Link>
            <span>›</span>
            <span>({user?.city}) {parking.name}</span>
            <span>›</span>
            <strong>{parking.level}</strong>
          </nav>
          <div className="occupancy">
            <strong>
              {parking.occupancy.free} / {parking.occupancy.total} мест свободно
            </strong>
            <div className="occupancy-bar">
              <span style={{ width: `${Math.max(8, ratio * 100)}%` }} />
            </div>
          </div>
        </div>
        <div className="scheme-header-right">
          <button type="button" className="route-btn" onClick={openRoute}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 19V7.8L12 4l7 3.8V19"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M12 22V12" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            Маршрут
          </button>
          <button
            type="button"
            className={`icon-round ${favorite ? 'is-fav' : ''}`}
            onClick={() => toggle(parking.id)}
            aria-label="Избранное"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M12 20C12 20 5 15.6 2.8 10.9C1.4 8 3.2 5 6.4 5C8.4 5 10.6 5.9 12 7.1C13.4 5.9 15.6 5 17.6 5C20.8 5 22.6 8 21.2 10.9C19 15.6 12 20 12 20Z"
                fill={favorite ? '#E36B7A' : 'none'}
                stroke={favorite ? '#E36B7A' : 'currentColor'}
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <UserMenu />
        </div>
      </header>

      <div className="scheme-layout">
        <section className="scheme-board">
          <div className="scheme-canvas">
            {parking.rows.map((row, index) => (
              <div key={row[0]?.id ?? index}>
                <div className="scheme-row">
                  {row.map((spot) => (
                    <SpotButton
                      key={spot.id}
                      spot={spot}
                      selected={spot.id === selectedId}
                      onSelect={() =>
                        setSelectedId((current) => (current === spot.id ? null : spot.id))
                      }
                    />
                  ))}
                </div>
                {index < parking.rows.length - 1 && (
                  <div className="driveway">
                    {index === 0 ? '→ проезд →' : '← проезд ←'}
                  </div>
                )}
              </div>
            ))}
            <div className="entrance-label">{parking.entranceLabel}</div>
          </div>
        </section>

        <aside className="scheme-side">
          <section className="side-card">
            <h2>Камеры</h2>
            <ul className="camera-list">
              {parking.cameras.map((camera) => (
                <li key={camera.id}>
                  <span className="cam-ico" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="7" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M16 10.5 21 8v8l-5-2.5" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </span>
                  {camera.name}
                  <span className={`cam-dot ${camera.online ? 'is-on' : ''}`} />
                </li>
              ))}
            </ul>
          </section>

          <section className="side-card">
            <h2>Обозначения</h2>
            <ul className="legend">
              <li>
                <span className="legend-swatch is-free" /> Свободно
              </li>
              <li>
                <span className="legend-swatch is-busy" /> Занято
              </li>
              <li>
                <span className="legend-swatch is-off" /> Нет покрытия камер
              </li>
            </ul>
          </section>

          <section className="privacy-note">
            <span className="privacy-ico">i</span>
            <p>
              Видео не передаётся и не хранится. Показан только статус мест, рассчитанный алгоритмом: это соответствует требованиям 152-ФЗ.
            </p>
          </section>

          {selected && (
            <section className="side-card selected-spot">
              Место <strong>{selected.label}</strong>
              {' — '}
              {selected.status === 'free'
                ? 'свободно'
                : selected.status === 'occupied'
                  ? 'занято'
                  : 'нет покрытия камер'}
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

function SpotButton({
  spot,
  selected,
  onSelect,
}: {
  spot: Spot
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      className={`spot spot-${spot.status} ${selected ? 'is-selected' : ''}`}
      onClick={onSelect}
    >
      {spot.label}
    </button>
  )
}
