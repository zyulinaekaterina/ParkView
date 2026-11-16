import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { MiniScheme } from '../components/MiniScheme'
import { SearchMap } from '../components/SearchMap'
import { UserMenu } from '../components/UserMenu'
import { useAuth } from '../context/AuthContext'
import { defaultCenter, parkings } from '../data/parkings'
import { formatDistance, haversineMeters, SEARCH_RADIUS_M } from '../lib/geo'
import { geocode } from '../lib/geocoding'
import type { ParkingType } from '../types'

type TypeFilter = 'all' | ParkingType

const DEFAULT_QUERY = 'ул. Тверская, 14'

export function MapPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const city = user?.city.trim() ?? ''
  const [query, setQuery] = useState(DEFAULT_QUERY)
  const [center, setCenter] = useState(defaultCenter)
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (!city || city.toLowerCase() === 'москва') return

    let active = true
    geocode(city)
      .then((location) => {
        if (!active) return
        if (location) setCenter(location)
        else setSearchError(`Не удалось найти город «${city}» на карте.`)
      })
      .catch(() => {
        if (!active) return
        setSearchError(`Не удалось определить город «${city}». Проверьте подключение.`)
      })

    return () => {
      active = false
    }
  }, [city])

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2 || city.toLowerCase() !== 'москва') return []
    return parkings.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        item.shortName.toLowerCase().includes(q),
    )
  }, [city, query])

  const nearby = useMemo(() => {
    return parkings
      .map((item) => ({
        parking: item,
        distance: haversineMeters(center, item),
      }))
      .filter((item) => item.parking.showOnMap)
      .filter((item) => item.distance <= SEARCH_RADIUS_M)
      .filter((item) => typeFilter === 'all' || item.parking.type === typeFilter)
      .sort((a, b) => a.distance - b.distance)
  }, [center, typeFilter])

  function applySearch(nextQuery: string, nextCenter = defaultCenter) {
    setQuery(nextQuery)
    setCenter(nextCenter)
    setSuggestionsOpen(false)
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSearchError(null)
    const match =
      suggestions[0] ??
      (city.toLowerCase() === 'москва'
        ? parkings.find((item) =>
            item.address.toLowerCase().includes(query.trim().toLowerCase()),
          )
        : undefined)
    if (match) {
      applySearch(match.address, { lat: match.lat, lng: match.lng })
      return
    }

    const address = query.trim()
    if (!address) {
      applySearch(DEFAULT_QUERY, defaultCenter)
      return
    }

    setIsSearching(true)
    try {
      const location = await geocode(`${address}, ${city}`)
      if (!location) {
        setSearchError(`Не удалось найти «${address}» в городе ${city}.`)
        return
      }
      applySearch(address, location)
    } catch {
      setSearchError('Поиск по карте не удался. Проверьте подключение и попробуйте ещё раз.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="map-page">
      <SearchMap
        center={center}
        items={nearby}
        onOpen={(id) => navigate(`/scheme/${id}`)}
      />

      <header className="map-top">
        <Logo />
        <div className="map-search-wrap">
          <form className="map-search" onSubmit={onSubmit}>
            <span className="map-search-city">({city})</span>
            <span className="map-search-pin" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSuggestionsOpen(true)
              }}
              onFocus={() => setSuggestionsOpen(true)}
              placeholder="Введите адрес или название..."
            />
            {isSearching && <span className="map-search-loading">Поиск…</span>}
          </form>
          {suggestionsOpen && suggestions.length > 0 && (
            <ul className="search-suggestions">
              {suggestions.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => applySearch(item.address, { lat: item.lat, lng: item.lng })}
                  >
                    <strong>{item.name}</strong>
                    <span>({city}) {item.address}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {searchError && (
            <p className="map-search-error" role="status">
              {searchError}
            </p>
          )}
          <div className="map-filters">
            <button
              type="button"
              className={typeFilter === 'all' ? 'chip chip-active' : 'chip'}
              onClick={() => setTypeFilter('all')}
            >
              Все
            </button>
            <button
              type="button"
              className={typeFilter === 'bc' ? 'chip chip-active' : 'chip'}
              onClick={() => setTypeFilter('bc')}
            >
              Бизнес-центры
            </button>
            <button
              type="button"
              className={typeFilter === 'jk' ? 'chip chip-active' : 'chip'}
              onClick={() => setTypeFilter('jk')}
            >
              Жилые комплексы
            </button>
          </div>
        </div>
        <UserMenu />
      </header>

      <section className="map-sheet">
        <div className="sheet-handle" />
        <div className="sheet-title">
          Парковки в радиусе {SEARCH_RADIUS_M} м
          <span> · {nearby.length}</span>
        </div>
        {nearby.length > 0 ? (
          <ul className="sheet-list">
            {nearby.map(({ parking, distance }) => {
              const busy = parking.occupancy.free === 0
              return (
                <li key={parking.id}>
                  <button
                    type="button"
                    className="sheet-item"
                    onClick={() => navigate(`/scheme/${parking.id}`)}
                  >
                    <MiniScheme parking={parking} />
                    <div className="sheet-item-info">
                      <strong>{parking.name}</strong>
                      <span>
                        {parking.address} · {formatDistance(distance)}
                      </span>
                    </div>
                    <div className={busy ? 'sheet-status is-busy' : 'sheet-status is-free'}>
                      {busy ? 'Нет мест' : `${parking.occupancy.free} свободно`}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="map-empty">
            В радиусе {SEARCH_RADIUS_M} м парковок не найдено. Попробуйте найти другой адрес.
          </p>
        )}
      </section>
    </div>
  )
}
