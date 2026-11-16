import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { parkings } from '../data/parkings'
import { useAuth } from './AuthContext'

type FavoritesContextValue = {
  ids: string[]
  isFavorite: (id: string) => boolean
  toggle: (id: string) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

function keyFor(userId: string) {
  return `parkview_favorites_${userId}`
}

function readIds(userId: string): string[] {
  const raw = localStorage.getItem(keyFor(userId))
  if (!raw) {
    const seeded = userId === 'demo-user' ? parkings.map((item) => item.id) : []
    localStorage.setItem(keyFor(userId), JSON.stringify(seeded))
    return seeded
  }

  try {
    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    localStorage.removeItem(keyFor(userId))
    return []
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [ids, setIds] = useState<string[]>(() => (user ? readIds(user.id) : []))

  useEffect(() => {
    setIds(user ? readIds(user.id) : [])
  }, [user])

  const value = useMemo<FavoritesContextValue>(() => {
    if (!user) {
      return {
        ids: [],
        isFavorite: () => false,
        toggle: () => undefined,
      }
    }
    return {
      ids,
      isFavorite: (id) => ids.includes(id),
      toggle: (id) => {
        setIds((current) => {
          const next = current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id]
          localStorage.setItem(keyFor(user.id), JSON.stringify(next))
          return next
        })
      },
    }
  }, [ids, user])

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
