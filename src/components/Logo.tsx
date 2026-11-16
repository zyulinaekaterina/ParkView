import { Link } from 'react-router-dom'

export function Logo({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="logo">
      <span className="logo-mark">P</span>
      <span className="logo-text">ParkView</span>
    </Link>
  )
}
