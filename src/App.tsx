import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthPage } from './pages/AuthPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { MapPage } from './pages/MapPage'
import { SchemePage } from './pages/SchemePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<MapPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/scheme/:id" element={<SchemePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
