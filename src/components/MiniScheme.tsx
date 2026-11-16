import type { Parking } from '../types'

export function MiniScheme({ parking }: { parking: Parking }) {
  const preview = parking.rows.slice(0, 2).map((row) => row.slice(0, 10))

  return (
    <div className="mini-scheme" aria-hidden="true">
      {preview.map((row, rowIndex) => (
        <div className="mini-row" key={rowIndex}>
          {row.map((spot) => (
            <span key={spot.id} className={`mini-cell mini-cell-${spot.status}`} />
          ))}
        </div>
      ))}
    </div>
  )
}
