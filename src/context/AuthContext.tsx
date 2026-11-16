import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type User = {
  id: string
  name: string
  email: string
  phone: string
  city: string
}

type StoredUser = User & { password: string }

type AuthContextValue = {
  user: User | null
  login: (login: string, password: string) => string | null
  register: (payload: {
    name: string
    email: string
    phone: string
    city: string
    password: string
  }) => string | null
  logout: () => void
}

const USERS_KEY = 'parkview_users'
const SESSION_KEY = 'parkview_session'
const DEFAULT_CITY = 'Москва'

const AuthContext = createContext<AuthContextValue | null>(null)

function normalizePhone(value: string): string {
  return value.replace(/\D/g, '')
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

function readUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY)
  if (!raw) {
    const demo: StoredUser = {
      id: 'demo-user',
      name: 'Алексей',
      email: 'name@mail.ru',
      phone: '+7 900 000-00-00',
      city: DEFAULT_CITY,
      password: 'password',
    }
    localStorage.setItem(USERS_KEY, JSON.stringify([demo]))
    return [demo]
  }

  try {
    const parsed = JSON.parse(raw) as StoredUser[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    localStorage.removeItem(USERS_KEY)
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function toPublic(user: StoredUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city || DEFAULT_CITY,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const sessionId = localStorage.getItem(SESSION_KEY)
    if (!sessionId) return null
    const found = readUsers().find((item) => item.id === sessionId)
    return found ? toPublic(found) : null
  })

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (login, password) => {
        const users = readUsers()
        const normalizedLogin = normalizeEmail(login)
        const found = users.find((item) => {
          if (item.password !== password) return false
          return (
            normalizeEmail(item.email) === normalizedLogin ||
            normalizePhone(item.phone) === normalizePhone(login)
          )
        })
        if (!found) return 'Неверный логин или пароль'
        localStorage.setItem(SESSION_KEY, found.id)
        setUser(toPublic(found))
        return null
      },
      register: ({ name, email, phone, city, password }) => {
        const users = readUsers()
        const normalizedEmail = normalizeEmail(email)
        const normalizedPhone = normalizePhone(phone)
        const normalizedCity = city.trim()

        if (
          users.some(
            (item) =>
              normalizeEmail(item.email) === normalizedEmail ||
              (normalizedPhone && normalizePhone(item.phone) === normalizedPhone),
          )
        ) {
          return 'Пользователь с таким email или телефоном уже зарегистрирован'
        }

        const created: StoredUser = {
          id: crypto.randomUUID(),
          name: name.trim() || normalizedEmail.split('@')[0],
          email: email.trim(),
          phone: phone.trim(),
          city: normalizedCity,
          password,
        }
        writeUsers([...users, created])
        localStorage.setItem(SESSION_KEY, created.id)
        setUser(toPublic(created))
        return null
      },
      logout: () => {
        localStorage.removeItem(SESSION_KEY)
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
