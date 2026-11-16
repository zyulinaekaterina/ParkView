import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { useAuth } from '../context/AuthContext'

export function AuthPage() {
  const { user, login, register } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('name@mail.ru')
  const [password, setPassword] = useState('password')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('Москва')

  if (user) return <Navigate to="/" replace />

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const result =
      mode === 'login'
        ? login(email, password)
        : register({ name, email, phone, city, password })
    setError(result)
  }

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div className="auth-hero-top">
          <Logo to="/login" />
        </div>
        <div className="auth-hero-copy">
          <h1>
            Свободное место — за
            <br />
            секунды
          </h1>
          <p>Актуальная схема парковки в реальном времени по данным камер наблюдения.</p>
        </div>
      </section>

      <section className="auth-panel">
        <form className="auth-card" onSubmit={onSubmit}>
          {mode === 'login' ? (
            <>
              <h2>Добро пожаловать</h2>
              <p className="auth-subtitle">Войдите, чтобы находить парковку</p>
            </>
          ) : (
            <>
              <h2>Создать аккаунт</h2>
              <p className="auth-subtitle">Зарегистрируйтесь, чтобы сохранять схемы</p>
            </>
          )}

          {mode === 'register' && (
            <>
              <label>
                Имя
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Алексей"
                  required
                />
              </label>
              <label>
                Телефон
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 900 000-00-00"
                />
              </label>
              <label>
                Город
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Москва"
                  required
                />
              </label>
            </>
          )}

          <label>
            Email или телефон
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@mail.ru"
              required
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          {mode === 'login' ? (
            <>
              <button type="submit" className="btn-primary">
                Войти
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setMode('register')
                  setError(null)
                  setPassword('')
                }}
              >
                Создать аккаунт
              </button>
            </>
          ) : (
            <>
              <button type="submit" className="btn-primary">
                Зарегистрироваться
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setMode('login')
                  setError(null)
                }}
              >
                Уже есть аккаунт
              </button>
            </>
          )}
        </form>
      </section>
    </div>
  )
}
