import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  if (!user) return null

  return (
    <div className="user-menu">
      <button
        type="button"
        className="avatar-btn"
        aria-label="Профиль"
        onClick={() => setOpen((value) => !value)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M5.5 19c1.4-3.2 3.7-4.8 6.5-4.8S17.6 15.8 19 19"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open && (
        <div className="user-dropdown">
          <div className="user-dropdown-name">{user.name}</div>
          <div className="user-dropdown-email">{user.email}</div>
          <div className="user-dropdown-city">Город: {user.city}</div>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              navigate('/favorites')
            }}
          >
            Избранное
          </button>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  )
}
