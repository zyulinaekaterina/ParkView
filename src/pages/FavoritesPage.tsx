import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { MiniScheme } from '../components/MiniScheme'
import { UserMenu } from '../components/UserMenu'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { parkings } from '../data/parkings'

export function FavoritesPage() {
  const { user } = useAuth()
  const { ids, toggle, isFavorite } = useFavorites()
  const navigate = useNavigate()
  const items = parkings.filter((item) => ids.includes(item.id))

  return (
    <div className="lk-page">
      <aside className="lk-sidebar">
        <Logo />
        <nav className="lk-nav">
          <Link to="/" className="lk-nav-item">
            <HomeIcon />
            Главная
          </Link>
          <Link to="/favorites" className="lk-nav-item is-active">
            <HeartIcon filled={false} />
            Избранное
          </Link>
        </nav>
      </aside>

      <main className="lk-main">
        <header className="lk-header">
          <div>
            <h1>Мои избранные парковки</h1>
            <p>Сохранённые схемы · город профиля: {user?.city}</p>
          </div>
          <UserMenu />
        </header>

        {items.length === 0 ? (
          <div className="empty-state">
            <p>Пока нет избранных схем.</p>
            <Link to="/" className="btn-primary empty-cta">
              Найти парковку
            </Link>
          </div>
        ) : (
          <div className="fav-grid">
            {items.map((parking) => (
              <article key={parking.id} className="fav-card">
                <button
                  type="button"
                  className="fav-heart"
                  aria-label="Убрать из избранного"
                  onClick={() => toggle(parking.id)}
                >
                  <HeartIcon filled={isFavorite(parking.id)} />
                </button>
                <button
                  type="button"
                  className="fav-card-body"
                  onClick={() => navigate(`/scheme/${parking.id}`)}
                >
                  <MiniScheme parking={parking} />
                  <h2>{parking.name}</h2>
                  <p>({user?.city}) {parking.address}</p>
                  <span className="fav-hint">{parking.hint}</span>
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20s-7-4.4-9.2-9.1C1.4 8 3.2 5 6.4 5c1.8 0 3.1 1 3.6 2.1C10.5 6 11.8 5 13.6 5c3.2 0 5 3 3.6 5.9C19 15.6 12 20 12 20Z"
        fill={filled ? '#E36B7A' : 'none'}
        stroke={filled ? '#E36B7A' : 'currentColor'}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}
